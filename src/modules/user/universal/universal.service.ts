import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {UsersDB} from "../../../database/entities/users/users-db.entity"
import {Repository} from "typeorm"
import {IUser} from "../all-users/types/all-users.types";
import {FriendsRequestsDB} from "../../../database/entities/friends/friends-request-db.entity";
import {FriendsUsersDB} from "../../../database/entities/friends/friends-users-db.entity";

@Injectable()
export class UniversalService {
    constructor(
        @InjectRepository(UsersDB) private readonly usersRepository: Repository<UsersDB>,
        @InjectRepository(FriendsRequestsDB) private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>,
        @InjectRepository(FriendsUsersDB) private readonly friendsUsersRepository: Repository<FriendsUsersDB>
    ) {}

    // нахождение и проверка существования юзера
    async universalCheckingUserExistence(userId: number): Promise<IUser | null> {
        return await this.usersRepository.findOne({
            where: {
                id: userId
            },
            // select - выбираем то что конкретно нам отдаст БД в ответе
            select: {
                id: true,
                login: true,
                name: true,
                lastname: true,
                status: true,
                lastSeen: true
            }
        })
    }

    // проверка наличия отправленной заявки на добавление в контакты
    async universalCheckingSubmittedRequestToAddContacts(senderId: number, receiverId: number): Promise<boolean> {
        const isSubmittedRequestToAddContacts = await this.friendsRequestsRepository.findOne({
            where: {
                senderId: senderId,
                receiverId: receiverId
            }
        })

        return !!isSubmittedRequestToAddContacts
    }

    // проверяем дружбу между юзерами
    async universalCheckingFriendship(userOneId: number, userTwoId: number): Promise<boolean> {
        const isUserFriend = await this.friendsUsersRepository.findOne({
            where: {
                userId: userOneId,
                friendId: userTwoId
            }
        })

        return !!isUserFriend
    }
}