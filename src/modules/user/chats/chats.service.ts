import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { FriendsUsersDB } from "../../../database/entities/friends/friends-users-db.entity"
import { ChatsListDB } from "../../../database/entities/chats/users-chats-list-db.entity"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"
import { Repository } from "typeorm"
import { ChatsMessageSendDto } from "../../DTO/chats/chats-send.dto"
import { IReqInfoUser, IResponseMessage } from "../../../global-types/types"
import {IChatsUser, IMassagesForChatUser} from "./types"
import {ChatsGetListMessagesDto} from "../../DTO/chats/chats-get-list-messages.dto"

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        @InjectRepository(FriendsUsersDB)
        private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        @InjectRepository(ChatsListDB)
        private readonly chatsListRepository: Repository<ChatsListDB>,
        @InjectRepository(MessagesDB)
        private readonly messageRepository: Repository<MessagesDB>
    ) {}

    async messageSend(dto: ChatsMessageSendDto, req: IReqInfoUser): Promise<IResponseMessage> {
        // проверяем что юзер не пишет сам себе
        if (dto.id === req.id) {
            throw new BadRequestException('Нельзя написать самому себе!')
        }

        // проверяем дружбу с тем юзером которому хотим написать сообщение
        const existingFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: req.id,
                friendId: dto.id
            }
        })

        if (!existingFriend) {
            throw new BadRequestException('Пользователя нет в ваших контактах!')
        }

        // сортируем id юзеров чтобы меньший был всегда userOneId а больший userTwoId
        // дабы избежать дублей в таблице с чатами
        const [userOneId, userTwoId] = req.id < dto.id ? [req.id, dto.id] : [dto.id, req.id]

        // ищем чат между пользователями
        let existingRecordChatInTable = await this.chatsListRepository.findOne({
            where: {
                userOneId: userOneId,
                userTwoId: userTwoId
            }
        })

        // проверить существует ли уже чат, если нет то создать новый
        if (!existingRecordChatInTable) {
            const record = this.chatsListRepository.create({
                userOneId: userOneId,
                userTwoId: userTwoId
            })

            existingRecordChatInTable = await this.chatsListRepository.save(record)
        }

        // если чат существует, то записываем в его айди новое сообщение
        const record = this.messageRepository.create({
            conversationId: existingRecordChatInTable.id,
            senderId: req.id,
            valueMessage: dto.messageValue
        })

        await this.messageRepository.save(record)

        return { message: "Сообщение отправлено"}
    }

    async getChatsList(req: IReqInfoUser): Promise<Array<IChatsUser>> {

        // получаем чаты в которых состоит пользователь
        const chatsList = await this.chatsListRepository.find({
            where: [
                { userOneId: req.id },
                { userTwoId: req.id }
            ],
            relations: {
                userOne: true,
                userTwo: true
            }
        })

        let response: Array<IChatsUser> = []

        if (chatsList.length) {
            response = chatsList.map((item: any) => {
                // выбираем объект второго участника чата
                const contactObj = item.userOne.id === req.id ? item.userTwo : item.userOne

                return {
                    id: contactObj.id,
                    login: contactObj.login
                }
            })
        }

        return response
    }

    async getChatsListMessages(req: IReqInfoUser, dto: ChatsGetListMessagesDto): Promise<IMassagesForChatUser> {
        // проверяем что пользователь с которым запрашивается чат существует
        const userWithWhomChat = await this.usersRepository.findOne({
            where: {
                id: dto.id
            }
        })

        if (!userWithWhomChat) {
            throw new BadRequestException('Пользователя не существует!')
        }

        // проверяем дружбу с тем юзером с которым хотим получить переписку
        const existingFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: req.id,
                friendId: dto.id
            }
        })

        if (!existingFriend) {
            throw new BadRequestException('Пользователя нет в ваших контактах!')
        }

        // сортируем id юзеров чтобы меньший был всегда userOneId а больший userTwoId
        // дабы избежать дублей в таблице с чатами
        const [userOneId, userTwoId] = req.id < dto.id ? [req.id, dto.id] : [dto.id, req.id]

        // ищем запись чата в таблице чатов между пользователями
        const existingRecordChatInTable = await this.chatsListRepository.findOne({
            where: {
                userOneId: userOneId,
                userTwoId: userTwoId
            }
        })

        let response: IMassagesForChatUser = {
            userLoginWithWhomChat: userWithWhomChat.login,
            messagesList: []
        }

        // если записи чата в таблице чатов между пользователями нет - то отдаем логин пользователя
        // с кем хотим создать чат и пустой массив сообщений
        if (!existingRecordChatInTable) {
            return response
        }

        // если запись чата в таблице чатов есть - то ищем все сообщения по этому id чата
        const messagesList = await this.messageRepository.find({
            where: {
                conversationId: existingRecordChatInTable.id,
            },

            select: {
                id: true,
                valueMessage: true,
                createdAt: true,
                sender: {
                    login: true
                }
            },

            order: {
                createdAt: "ASC"
            },

            relations: ['sender']
        })

        // если сообщения есть
        if (messagesList.length) {
            response.messagesList = messagesList.map((item: any) => {
                return {
                    idMessage: item.id,
                    value: item.valueMessage,
                    created: item.createdAt,
                    userLoginSendMessage: item.sender.login,
                }
            })
        }

        return response
    }
}