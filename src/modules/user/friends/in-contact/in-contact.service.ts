import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { Repository } from "typeorm"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import { IContactUser } from "./types"
import type { IReqInfo, IReqInfoUser} from "../../../../global-types/types"
import { IGetCurrentUserDTO } from "../../../DTO/all-users/all-users.dto"

@Injectable()
export class InContactService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        @InjectRepository(FriendsUsersDB)
        private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        @InjectRepository(FriendsRequestsDB)
        private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>
    ) {}

    // удаляем контакт из своих контактов и удаляем себя из списка его контактов
    async deleteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        const isUserFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: req.id,
                friendId: dto.id
            }
        })

        if (!isUserFriend) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        await this.friendsUsersRepository.delete([
            {
                userId: req.id,
                friendId: dto.id,
            },
            {
                userId: dto.id,
                friendId: req.id,
            }
        ])

        return {
            message: "Вы удалили контакт"
        }
    }

    // получение списка контактов пользователя
    async getContactsList(req: IReqInfoUser): Promise<Array<IContactUser>> {
        const isUserFriend = await this.friendsUsersRepository.find({
            where: {
                userId: req.id
            },
            relations: ['friend'],
            // select - выбираем то что конкретно нам отдаст БД в ответе
            select: {
                friendId: true,
                friend: {
                    id: true,
                    login: true,
                    name: true,
                    lastname: true,
                    status: true
                }
            }
        })

        let result: Array<IContactUser> = []

        if (isUserFriend?.length) {
            result = isUserFriend.map((item: any) => {
                return item.friend
            })
        }

        return result
    }

    // получение текущего контакта
    async getCurrentContact(dto: IGetCurrentUserDTO, req: IReqInfoUser): Promise<IContactUser> {
        // проверяем на то - существует ли вообще запрашиваемый юзер
        const user = await this.usersRepository.findOne({
            where: {
                id: dto.id
            },
            select: {
                id: true,
                login: true,
                name: true,
                lastname: true,
                status: true
            }
        })

        if (!user) {
            throw new NotFoundException("Пользователь не найден")
        }

        // проверяем дружбу между юзерами
        const isUserFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: req.id,
                friendId: dto.id
            }
        })

        if (!isUserFriend || !isUserFriend) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        return user
    }
}