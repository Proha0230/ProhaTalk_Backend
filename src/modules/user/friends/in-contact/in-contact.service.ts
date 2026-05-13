import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { Repository } from "typeorm"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import {IContactUser} from "./types";
import {IReqInfoUser} from "../../../../global-types/types";

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
        const isUserFriend = await this.friendsUsersRepository.find({
            where: {
                userId: req.id,
                friendId: dto.id
            }
        })

        if (!isUserFriend || (Array.isArray(isUserFriend) && !isUserFriend.length)) {
            throw new BadRequestException("Этого пользователя в ваших контактах не найдено")
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
}