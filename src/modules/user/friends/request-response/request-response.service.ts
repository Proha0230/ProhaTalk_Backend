import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource } from 'typeorm'
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { Repository } from "typeorm"
import {InviteFriendDTO} from "../../../DTO/friends/friends.dto"

@Injectable()
export class RequestResponseService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,

        @InjectRepository(FriendsUsersDB)
        private readonly friendsUsersRepository: Repository<FriendsUsersDB>,

        @InjectRepository(FriendsRequestsDB)
        private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>,

        private readonly dataSource: DataSource
    ) {}

    async sendInviteFriend(dto: InviteFriendDTO, req: { login: string, id: number}): Promise<any> {
        if (dto.ptid === req.id) {
            throw new BadRequestException('Нельзя добавить в контакты самого себя')
        }

        const user = await this.usersRepository.findOne({
            where: {
                id: dto.ptid
            }
        })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        const existingFriend = await this.friendsUsersRepository.findOne({
                where: {
                    userId: req.id,
                    friendId: dto.ptid
                }
        })

        if (existingFriend) {
            throw new BadRequestException('Пользователь уже в контактах',)
        }

        const existingRequest = await this.friendsRequestsRepository.findOne({
                where: {
                    senderId: req.id,
                    receiverId: dto.ptid
                }
        })

        if (existingRequest) {
            throw new BadRequestException('Заявка уже отправлена ранее!',)
        }

        const request = this.friendsRequestsRepository.create({
                senderId: req.id,
                receiverId: dto.ptid
            })

        await this.friendsRequestsRepository.save(request)

        return {
            message: 'Заявка на добавление в контакты отправлена'
        }
    }

    async cancelInviteFriend(dto: InviteFriendDTO, req: { login: string, id: number}): Promise<any> {
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: req.id,
                receiverId: dto.ptid,
            }
        })

        if (!request) {
            throw new BadRequestException(
                'Заявка не найдена'
            )
        }

        await this.friendsRequestsRepository.delete({
            senderId: req.id,
            receiverId: dto.ptid,
        })

        return {
            message: "Заявка на добавление в контакты отменена"
        }
    }

    async declineInviteFriend(dto: InviteFriendDTO, req: { login: string, id: number}): Promise<any> {
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: dto.ptid,
                receiverId: req.id,
            }
        })

        if (!request) {
            throw new BadRequestException(
                'Заявка не найдена'
            )
        }

        await this.friendsRequestsRepository.delete({
            senderId: dto.ptid,
            receiverId: req.id,
        })

        return {
            message: "Заявка на добавление в контакты отклонена"
        }
    }

    async acceptInviteFriend(dto: InviteFriendDTO, req: { login: string, id: number}): Promise<any> {
        // ищем заявку
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: dto.ptid,
                receiverId: req.id
            }
        })

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        // проверяем уже друзья?
        const existingFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: req.id,
                friendId: dto.ptid
            }
        })

        if (existingFriend) {
            throw new BadRequestException('Пользователь уже находится у вас в контактах')

        }


        // запускаем транзакцию - либо выполнится все, либо если часть только выполнится,
        // то будет роллбэк в таком случае и изменения частичные не будут применены
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // СОЗДАЁМ ДРУЖБУ

            // я -> он
            const friendOne = this.friendsUsersRepository.create({
                userId: req.id,
                friendId: dto.ptid,
            })

            // он -> я
            const friendTwo = this.friendsUsersRepository.create({
                userId: dto.ptid,
                friendId: req.id,
            })

            // сохраняем обе записи в бд друзей
            await this.friendsUsersRepository.save([
                friendOne,
                friendTwo,
            ])

            // удаляем заявку из бд заявок
            await this.friendsRequestsRepository.delete({
                senderId: dto.ptid,
                receiverId: req.id,
            })

            await queryRunner.commitTransaction()

            return {
                message: "Вы приняли в контакты пользователя"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()

            throw new BadRequestException('Произошла ошибка операции, повторите позже')
        } finally {
            await queryRunner.release()
        }
    }

    // получаем список кому мы отправили заявку на добавление в контакты (исходящие)
    async getOutgoingRequests(req: { login: string, id: number}): Promise<any> {
        const requests = await this.friendsRequestsRepository.find({
            where: {
                senderId: req.id,
            },

            // здесь укащывает что получает объекты тех юзеров, которым мы отправили заявки
            relations: ['receiver']
        })

        return requests.map((request) => ({
            id: request.receiver.id,
            login: request.receiver.login,
            status: request.receiver.status,
        }))
    }

    // получаем список кто нас добавил в контакты (входящие)
    async getIncomingRequests(req: { login: string, id: number}): Promise<any> {
        const requests = await this.friendsRequestsRepository.find({
            where: {
                receiverId: req.id,
            },

            // здесь указываем что получаем объекты тех юзеров из usersDB которые нам отправили заявки
            relations: ['sender']
        })

        return requests.map((request) => ({
            id: request.sender.id,
            login: request.sender.login,
            status: request.sender.status,
        }))
    }
}