import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { IGetCurrentUserDTO } from "../../DTO/all-users/all-users.dto"
import { IUser, IUserInAllUsers } from "./types/all-users.types"
import { IReqInfoUser } from "../../../global-types/types"
import { UniversalService } from "../universal/universal.service"

@Injectable()
export class AllUsersService {
    constructor(
        @InjectRepository(UsersDB) private readonly usersRepository: Repository<UsersDB>,
        private readonly universalService: UniversalService
    ) {}

    async getAllUsers(): Promise<Array<IUser>> {
        // когда не указываем where: {} - то отдадутся все записи
        return await this.usersRepository.find({
            // select - выбираем то что конкретно нам отдаст БД в ответе
            select: {
                id: true,
                login: true,
                name: true,
                lastname: true,
                status: true,
                avatar: true
            }
        })
    }

    async getCurrentUser(dto: IGetCurrentUserDTO, req: IReqInfoUser): Promise<IUserInAllUsers> {
        // нахождение и проверка существования юзера
        const user = await this.universalService.universalCheckingUserExistence({ userId: dto.id })

        if (!user) {
            throw new NotFoundException("Пользователь не найден")
        }

        // это карточка юзера кто запросил информацию о юзере (Это вы)
        const isUserLookingAtHimself = dto.id === req.id
        let usersFriendship = false
        let isSubmittedRequestToAddContacts = false

        if (!isUserLookingAtHimself) {
            // проверяем дружбу между юзерами
            usersFriendship = await this.universalService.universalCheckingFriendship(req.id, dto.id)

            // проверка наличия отправленной заявки на добавление в контакты
            isSubmittedRequestToAddContacts = await this.universalService.universalCheckingSubmittedRequestToAddContacts(req.id, dto.id)
        }

        return {
            ...user,
            usersFriendship,
            isSubmittedRequestToAddContacts,
            isUserLookingAtHimself
        }
    }
}