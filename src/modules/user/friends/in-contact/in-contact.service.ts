import { Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { Repository } from "typeorm"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import { IContactUser } from "./types"
import type { IReqInfoUser} from "../../../../global-types/types"
import { IGetCurrentUserDTO } from "../../../DTO/all-users/all-users.dto"
import { UniversalService } from "../../universal/universal.service"

@Injectable()
export class InContactService {
    constructor(
        @InjectRepository(FriendsUsersDB) private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        private readonly universalService: UniversalService
    ) {}

    // удаляем контакт из своих контактов и удаляем себя из списка его контактов
    async deleteFriend(dto: InviteFriendDTO, req: IReqInfoUser): Promise<any> {
        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (!usersFriendship) {
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
        // нахождение и проверка существования юзера
        const user = await this.universalService.universalCheckingUserExistence(dto.id)

        if (!user) {
            throw new NotFoundException("Пользователь не найден")
        }

        // проверяем дружбу между юзерами
        const usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

        if (!usersFriendship) {
            throw new NotFoundException("Этого пользователя в ваших контактах не найдено")
        }

        return user
    }
}