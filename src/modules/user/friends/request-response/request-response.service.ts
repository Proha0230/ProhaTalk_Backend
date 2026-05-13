import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource } from 'typeorm'
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { Repository } from "typeorm"
import {InviteFriendDTO} from "../../../DTO/friends/friends.dto"
import { IReqInfoUser } from "../../../../global-types/types"

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

    async sendInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        if (dto.id === req.id) {
            throw new BadRequestException('Нельзя добавить в контакты самого себя')
        }

        const user = await this.usersRepository.findOne({
            where: {
                id: dto.id
            }
        })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        const existingFriend = await this.friendsUsersRepository.findOne({
                where: {
                    userId: req.id,
                    friendId: dto.id
                }
        })

        if (existingFriend) {
            throw new BadRequestException('Пользователь уже в контактах',)
        }

        const existingRequest = await this.friendsRequestsRepository.findOne({
                where: {
                    senderId: req.id,
                    receiverId: dto.id
                }
        })

        if (existingRequest) {
            throw new BadRequestException('Заявка уже отправлена ранее!',)
        }

        const request = this.friendsRequestsRepository.create({
                senderId: req.id,
                receiverId: dto.id
            })

        await this.friendsRequestsRepository.save(request)

        return {
            message: 'Заявка на добавление в контакты отправлена'
        }
    }

    async cancelInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: req.id,
                receiverId: dto.id,
            }
        })

        if (!request) {
            throw new BadRequestException(
                'Заявка не найдена'
            )
        }

        await this.friendsRequestsRepository.delete({
            senderId: req.id,
            receiverId: dto.id,
        })

        return {
            message: "Заявка на добавление в контакты отменена"
        }
    }

    async declineInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: dto.id,
                receiverId: req.id,
            }
        })

        if (!request) {
            throw new BadRequestException(
                'Заявка не найдена'
            )
        }

        await this.friendsRequestsRepository.delete({
            senderId: dto.id,
            receiverId: req.id,
        })

        return {
            message: "Заявка на добавление в контакты отклонена"
        }
    }

    async acceptInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        // ищем заявку
        const request = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: dto.id,
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
                friendId: dto.id
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
                friendId: dto.id,
            })

            // он -> я
            const friendTwo = this.friendsUsersRepository.create({
                userId: dto.id,
                friendId: req.id,
            })

            // сохраняем обе записи в бд друзей
            await this.friendsUsersRepository.save([
                friendOne,
                friendTwo,
            ])

            // удаляем заявку из бд заявок
            await this.friendsRequestsRepository.delete({
                senderId: dto.id,
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
    async getOutgoingRequests(req: IReqInfoUser): Promise<any> {
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
            name: request.receiver.name,
            lastname: request.receiver.lastname,
            status: request.receiver.status,
        }))
    }

    // получаем список кто нас добавил в контакты (входящие)
    async getIncomingRequests(req: IReqInfoUser): Promise<any> {
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
            name: request.sender.name,
            lastname: request.sender.lastname,
            status: request.sender.status,
        }))
    }
}