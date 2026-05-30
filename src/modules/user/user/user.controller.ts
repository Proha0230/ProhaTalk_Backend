import { Controller, Get, NotFoundException, Query, Res, UseGuards } from "@nestjs/common"
import { UserService } from "./user.service"
import { AuthGuard } from "@nestjs/passport"
import { GetUserAvatarDTO } from "../../DTO/user/user/user.dto"
import type { Response } from "express"

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get('get-avatar')
    @UseGuards(AuthGuard('jwt'))
    async getUserAvatar(
        @Query() dto: GetUserAvatarDTO,
        @Res() res: Response
    ) {
        const stream = await this.userService.getUserAvatar(dto)

        if (!stream) {
            throw new NotFoundException('Фото профиля не найдено')
        }

        res.contentType('image/webp')

        return stream.pipe(res)
    }
}