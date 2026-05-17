import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { UserProfileDto } from "../../DTO/user/profile/user-profile.dto"
import { IObjUserProfile } from "./types/profile.types"
import { IReqInfoUser } from "../../../global-types/types"
import { UniversalService } from "../universal/universal.service"

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
        private readonly universalService: UniversalService
    ) {}

    async changeInfo(dto: UserProfileDto, req: IReqInfoUser): Promise<{ message: string}> {
        // нахождение и проверка существования юзера
        const user = await this.universalService.universalCheckingUserExistence(req.id)

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        let isChanged = false

        if (dto.name !== undefined && dto.name !== null) {
            user.name = dto.name.trim() === '' ? null : dto.name.replace(/\s+/g, '')
            isChanged = true
        }

        if (dto.lastname !== undefined && dto.lastname !== null) {
            user.lastname = dto.lastname.trim() === '' ? null : dto.lastname.replace(/\s+/g, '')
            isChanged = true
        }

        if (dto.status !== undefined && dto.status !== null) {
            user.status = dto.status.trim() === '' ? null : dto.status
            isChanged = true
        }

        if (isChanged) {
            user.lastSeen = new Date()
        }

        await this.usersRepository.save(user)

        return { message: "Изменения применены!" }
    }

    async getUserInfo(req: IReqInfoUser): Promise<IObjUserProfile> {
        // нахождение и проверка существования юзера
        const user = await this.universalService.universalCheckingUserExistence(req.id)

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        return user
    }
}