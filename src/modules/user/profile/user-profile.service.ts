import {BadRequestException, Injectable} from '@nestjs/common'
import { InjectRepository } from "@nestjs/typeorm"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { Repository } from "typeorm"
import { UserProfileDto } from "../../DTO/user/profile/user-profile.dto"
import { IObjUserProfile } from "./types/profile.types"
import { IReqInfoUser } from "../../../global-types/types"

@Injectable()
export class UserProfileService {
    constructor(
        @InjectRepository(UsersDB)
        private readonly usersRepository: Repository<UsersDB>,
    ) {}

    async changeInfo(dto: UserProfileDto, req: IReqInfoUser): Promise<{ message: string}> {
        // находим юзера в БД
        const user = await this.usersRepository.findOne({
            where: {
                id: req.id,
            }
        })

        if (!user) {
            // если его нет, то возвращаем ошибку
            throw new BadRequestException('Пользователь не найден')
        } else {
            let isChanged = false

            if (dto.name !== undefined && dto.name !== null) {
                user.name = dto.name.trim() === '' ? null : dto.name.replace(/\s+/g, '')
                isChanged = true
            }

            if (dto.lastName !== undefined && dto.lastName !== null) {
                user.lastname = dto.lastName.trim() === '' ? null : dto.lastName.replace(/\s+/g, '')
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
    }

    async getUserInfo(req: IReqInfoUser): Promise<IObjUserProfile> {
        // находим юзера в БД
        const user = await this.usersRepository.findOne({
            where: {
                id: req.id,
            }
        })

        if (!user) {
            // если его нет, то возвращаем ошибку
            throw new BadRequestException('Не удалось получить информацию о пользователе')
        } else {
            return {
                login: user.login,
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                status: user.status,
            }
        }
    }
}