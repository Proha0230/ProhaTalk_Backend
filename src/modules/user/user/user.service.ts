import {BadRequestException, Injectable} from "@nestjs/common"
import { UniversalService } from "../universal/universal.service"
import { GetUserAvatarDTO } from "../../DTO/user/user/user.dto"
import * as fs from "fs"

@Injectable()
export class UserService {
    constructor(
        private readonly universalService: UniversalService
    ) {}

    async getUserAvatar(dto: GetUserAvatarDTO): Promise<fs.ReadStream | null> {
        // получаем запись юзера
        const user = await this.universalService.universalCheckingUserExistence(dto.id)

        if (!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        if (!user.avatar) {
            return null
        }

        // получаем его аватарку из БД (SSD)
        return this.universalService.getBlobFileInDB(user.id, user.avatar, "a")
    }
}