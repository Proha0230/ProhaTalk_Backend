import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { ChatsListDB } from "../../../database/entities/chats/users-chats-list-db.entity"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"
import { Repository } from "typeorm"
import { ChatsSendTextMessageDto } from "../../DTO/chats/chats-send-text-message.dto"
import { IReqInfoUser, IResponseMessage } from "../../../global-types/types"
import { IChatsUser, IMassage, IMassagesForChatUser } from "./types"
import { ChatsGetListMessagesDto } from "../../DTO/chats/chats-get-list-messages.dto"
import { UniversalService } from "../universal/universal.service"
import fs from "fs"

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatsListDB) private readonly chatsListRepository: Repository<ChatsListDB>,
        @InjectRepository(MessagesDB) private readonly messageRepository: Repository<MessagesDB>,

        private readonly universalService: UniversalService
    ) {}

    async messageTextSend(dto: ChatsSendTextMessageDto, req: IReqInfoUser, isWebSocket?: boolean): Promise<IResponseMessage | MessagesDB> {
        // проверяем что юзер не пишет сам себе
        if (dto.id === req.id) {
            throw new BadRequestException('Нельзя написать самому себе!')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
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
            valueMessage: dto.messageValue,
            isAudio: false,
            isText: true,
            isPicture: false
        })

        await this.messageRepository.save(record)

        if (isWebSocket) {
            return record
        } else {
            return { message: "Сообщение отправлено" }
        }
    }

    // отправка голосового сообщения и сохранение ее в БД (SSD)
    async messageVoiceSend(voiceMessageFile: Express.Multer.File, req: IReqInfoUser, userIDWhomSending: string) {
        // проверяем что юзер не пишет сам себе
        if (+userIDWhomSending === req.id) {
            throw new BadRequestException('Нельзя написать самому себе!')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, +userIDWhomSending)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        // сортируем id юзеров чтобы меньший был всегда userOneId а больший userTwoId
        // дабы избежать дублей в таблице с чатами
        const [userOneId, userTwoId] = req.id < +userIDWhomSending ? [req.id, +userIDWhomSending] : [+userIDWhomSending, req.id]

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

        // сохраняем аудио запись в БД (SSD)
        const nameVoiceRecord = await this.universalService.universalCreateBlobVoiceInDB(req.id, voiceMessageFile)


        // если чат существует, то записываем в его айди новое сообщение
        const record = this.messageRepository.create({
            conversationId: existingRecordChatInTable.id,
            senderId: req.id,
            valueMessage: nameVoiceRecord.fileName,
            isAudio: true,
            isText: false,
            isPicture: false
        })

        await this.messageRepository.save(record)

        // возвращаем id записи голосового сообщения в таблице для ws
        // и название голосовой записи в БД (SSD)
        return { idM: record.id, mV: nameVoiceRecord.fileName}
    }

    // получение voice message из чата пользователей
    async getVoiceMessage(req: IReqInfoUser, voiceMessageName: string, loginUserSendMessage: string): Promise<fs.ReadStream> {
        // получаем юзера
        const user = await this.universalService.universalCheckingUserExistence({ userId: req.id })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        // если пользователь отправивший голосовое сам юзер, то сразу получаем голосовое сообщение
        if (user.login === loginUserSendMessage) {
            return this.universalService.getBlobFileInDB(user.id, voiceMessageName, "mv")
        }

        // если это другой юзер отправил голосовое, то ищем его по login'у
        const userWhoSendMessage = await this.universalService.universalCheckingUserExistence({ userLogin: loginUserSendMessage })

        if (!userWhoSendMessage) {
            throw new BadRequestException('Пользователь не найден')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, userWhoSendMessage.id)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        return this.universalService.getBlobFileInDB(userWhoSendMessage.id, voiceMessageName, "mv")
    }

    // получаем запись голосового сообщения из таблицы с сообщениями
    async getVoiceMessageRecord(req: IReqInfoUser, valueMessage: string, messageId: number, userIDWhomSending: number) {
        // получаем юзера
        const user = await this.universalService.universalCheckingUserExistence({ userId: req.id })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, userIDWhomSending)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        const recordVoiceMessage = await this.messageRepository.findOne({
            where: {
                id: messageId,
                valueMessage
            },

            select: {
                id: true,
                valueMessage: true,
                createdAt: true,
                isAudio: true,
                isText: true,
                isPicture: true,
                sender: {
                    login: true
                }
            },

            relations: ['sender']
        })

        if (recordVoiceMessage) {
            return {
                idMessage: recordVoiceMessage.id,
                value: recordVoiceMessage.valueMessage,
                created: recordVoiceMessage.createdAt,
                userLoginSendMessage: recordVoiceMessage.sender.login,
                isAudio: recordVoiceMessage.isAudio,
                isText: recordVoiceMessage.isText,
                isPicture: recordVoiceMessage.isPicture
            }
        }

        return {}
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
            },
            select: {
                userOne: {
                    id: true,
                    login: true
                },
                userTwo: {
                    id: true,
                    login: true
                }
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

    async getChatMessage(message: MessagesDB): Promise<IMassage | {}> {
        const getMessageInDB = await this.messageRepository.findOne({
            where: {
                conversationId: message.conversationId,
                senderId: message.senderId,
                valueMessage: message.valueMessage
            },

            select: {
                id: true,
                valueMessage: true,
                createdAt: true,
                isAudio: true,
                isText: true,
                isPicture: true,
                sender: {
                    login: true
                }
            },

            relations: ['sender']
        })

        if (getMessageInDB) {
            return {
                idMessage: getMessageInDB.id,
                value: getMessageInDB.valueMessage,
                created: getMessageInDB.createdAt,
                userLoginSendMessage: getMessageInDB.sender.login,
                isAudio: getMessageInDB.isAudio,
                isText: getMessageInDB.isText,
                isPicture: getMessageInDB.isPicture
            }
        }

        return {}
    }

    async getChatsListMessages(req: IReqInfoUser, dto: ChatsGetListMessagesDto): Promise<IMassagesForChatUser> {
        // нахождение и проверка существования юзера с которым запрашивается чат
        const userWithWhomChat = await this.universalService.universalCheckingUserExistence({ userId: dto.id })

        if (!userWithWhomChat) {
            throw new BadRequestException('Пользователь не найден')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
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
                conversationId: existingRecordChatInTable.id
            },

            select: {
                id: true,
                valueMessage: true,
                createdAt: true,
                isPicture: true,
                isAudio: true,
                isText: true,
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
                    isPicture: item.isPicture,
                    isAudio: item.isAudio,
                    isText: item.isText
                }
            })
        }

        return response
    }
}