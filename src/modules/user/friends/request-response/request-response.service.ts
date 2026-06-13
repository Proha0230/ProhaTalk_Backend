import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource } from 'typeorm'
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { Repository } from "typeorm"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import { IReqInfoUser } from "../../../../global-types/types"
import { UniversalService } from "../../universal/universal.service"
import { IUser } from "../../all-users/types/all-users.types"

@Injectable()
export class RequestResponseService {
    constructor(
        @InjectRepository(FriendsUsersDB) private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        @InjectRepository(FriendsRequestsDB) private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>,

        private readonly universalService: UniversalService,

        private readonly dataSource: DataSource
    ) {}

    // отправка исходящей заявки на добавление в контакты юзера
    async sendInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        if (dto.id === req.id) {
            throw new BadRequestException('Нельзя добавить в контакты самого себя')
        }

        // нахождение и проверка существования юзера
        const user = await this.universalService.universalCheckingUserExistence({ userId: dto.id })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (usersFriendship) {
            throw new BadRequestException('Пользователь уже в контактах')
        }

        // проверка наличия отправленной заявки на добавление в контакты
        const existingRequest = await this.universalService.universalCheckingSubmittedRequestToAddContacts(req.id, dto.id)

        if (existingRequest) {
            throw new BadRequestException('Заявка уже отправлена ранее!')
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

    // отмена отправленной исходящей заявки юзером на добавление в контакты
    async cancelInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        // проверка наличия отправленной исходящей заявки на добавление в контакты
        const request = this.universalService.universalCheckingSubmittedRequestToAddContacts(req.id, dto.id)

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        await this.friendsRequestsRepository.delete({
            senderId: req.id,
            receiverId: dto.id,
        })

        return {
            message: "Заявка на добавление в контакты отменена"
        }
    }

    // отклонение входящей заявки на добавление в контакты
    async declineInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        // проверка наличия отправленной входящей заявки на добавление в контакты
        const request = this.universalService.universalCheckingSubmittedRequestToAddContacts(dto.id, req.id)

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        await this.friendsRequestsRepository.delete([
            {
                senderId: dto.id,
                receiverId: req.id,
            },
            {
                senderId: req.id,
                receiverId: dto.id,
            }
        ])

        return {
            message: "Заявка на добавление в контакты отклонена"
        }
    }

    // принятие входящей заявки на добавление в контакты юзера
    async acceptInviteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        // проверка наличия отправленной входящей заявки на добавление в контакты
        const request = this.universalService.universalCheckingSubmittedRequestToAddContacts(dto.id, req.id)

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (usersFriendship) {
            throw new BadRequestException('Пользователь уже в контактах')
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
            await this.friendsRequestsRepository.delete([
                {
                    senderId: dto.id,
                    receiverId: req.id,
                },
                {
                    senderId: req.id,
                    receiverId: dto.id,
                }
            ])

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
            relations: ['receiver'],
            select: {
                senderId: true,
                receiver: {
                    id: true,
                    login: true,
                    name: true,
                    lastname: true,
                    lastSeen: true,
                    status: true,
                    avatar: true
                }
            }
        })

        return requests.map((request) => ({
            id: request.receiver.id,
            login: request.receiver.login,
            name: request.receiver.name,
            lastname: request.receiver.lastname,
            lastSeen: request.receiver.lastSeen,
            status: request.receiver.status,
            avatar: request.receiver.avatar
        }))
    }

    // получаем список кто нас добавил в контакты (входящие)
    async getIncomingRequests(req: IReqInfoUser): Promise<any> {
        const requests = await this.friendsRequestsRepository.find({
            where: {
                receiverId: req.id,
            },

            // здесь указываем что получаем объекты тех юзеров из usersDB которые нам отправили заявки
            relations: ['sender'],

            select: {
                receiverId: true,
                sender: {
                    id: true,
                    login: true,
                    name: true,
                    lastname: true,
                    lastSeen: true,
                    status: true,
                    avatar: true
                }
            }
        })

        return requests.map((request) => ({
            id: request.sender.id,
            login: request.sender.login,
            name: request.sender.name,
            lastname: request.sender.lastname,
            lastSeen: request.sender.lastSeen,
            status: request.sender.status,
            avatar: request.sender.avatar
        }))
    }

    // получаем текущего юзера кто отправил заявку на добавление нас в контакты (входящие)
    async getCurrentUserIncomingRequest(req: IReqInfoUser, dto: InviteFriendDTO): Promise<IUser> {
        // проверка наличия отправленной входящей заявки на добавление в контакты
        const request = this.universalService.universalCheckingSubmittedRequestToAddContacts(dto.id, req.id)

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(dto.id, req.id)

        if (usersFriendship) {
            throw new BadRequestException('Пользователь уже в контактах')
        }

        const user = await this.universalService.universalCheckingUserExistence({ userId: dto.id })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        return user
    }

    // получаем текущего юзера кому мы отправили заявку на добавление в контакты (исходящие)
    async getCurrentUserOutgoingRequest(req: IReqInfoUser, dto: InviteFriendDTO): Promise<IUser> {
        // проверка наличия отправленной исходящей заявки на добавление в контакты
        const request = this.universalService.universalCheckingSubmittedRequestToAddContacts(req.id, dto.id)

        if (!request) {
            throw new BadRequestException('Заявка на добавление в контакты не найдена')
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (usersFriendship) {
            throw new BadRequestException('Пользователь уже в контактах')
        }

        const user = await this.universalService.universalCheckingUserExistence({ userId: dto.id })

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        return user
    }
}