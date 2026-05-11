import {Injectable} from '@nestjs/common'
import {InjectRepository} from "@nestjs/typeorm"
import {UsersDB} from "../../../database/entities/users/users-db.entity"
import {FriendsUsersDB} from "../../../database/entities/friends/friends-users-db.entity"
import {FriendsRequestsDB} from "../../../database/entities/friends/friends-request-db.entity"
import {Repository} from "typeorm"

@Injectable()
export class AllUsersService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        @InjectRepository(FriendsUsersDB)
        private readonly friendsUsersRepository: Repository<FriendsUsersDB>,
        @InjectRepository(FriendsRequestsDB)
        private readonly friendsRequestsRepository: Repository<FriendsRequestsDB>
    ) {}

    async getAllUsers(): Promise<any> {
        // когда не указываем where: {} - то отдадутся все записи
        return await this.usersRepository.find({
            // select - выбираем то что конкретно нам отдаст БД в ответе
            select: {
                id: true,
                login: true,
                name: true,
                lastname: true,
                status: true
            }
        })
    }
}