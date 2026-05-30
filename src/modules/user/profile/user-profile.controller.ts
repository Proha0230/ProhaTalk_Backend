import {
    Body, Controller, Post, Get, UseGuards, Req, UseInterceptors,
    UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator,
    Res, NotFoundException, Delete
} from '@nestjs/common'
import { UserProfileService } from './user-profile.service'
import { UserProfileDto } from "../../DTO/user/profile/user-profile.dto"
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"
import { FileInterceptor } from "@nestjs/platform-express"
import type { Response } from 'express'

@Controller('api/user-profile')
export class UserProfileController {
    constructor(
        private readonly userProfileService: UserProfileService
    ) {}

    @Post('change-info')
    @UseGuards(AuthGuard('jwt'))
    changeInfo(
        @Body() dto: UserProfileDto,
        @Req() req: IReqInfo
    ): Promise<{ message: string }> {
        return this.userProfileService.changeInfo(dto, req.user)
    }

    @Get('info')
    @UseGuards(AuthGuard('jwt'))
    getUserInfo(
        @Req() req: IReqInfo
    ) {
        return this.userProfileService.getUserInfo(req.user)
    }

    @Post('change-avatar')
    @UseGuards(AuthGuard('jwt'))
    // называем отправляемый файл в ForData 'avatar'
    @UseInterceptors(FileInterceptor('avatar', {
        // максимум 7мб
        limits: {
            fileSize: 7 * 1024 * 1024
        }
    }))
    changeAvatar(
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    // поддерживаемые типы png/jpeg/jpg
                    new FileTypeValidator({
                        fileType: /(image\/png|image\/jpeg)/
                    }),
                    // максимум 7мб
                    new MaxFileSizeValidator({
                        maxSize: 7 * 1024 * 1024,
                    })
                ]
            })
        ) avatarFile: Express.Multer.File,
        @Req() req: IReqInfo
    ) {
        return this.userProfileService.changeAvatar(avatarFile, req.user)
    }

    @Get('get-avatar')
    @UseGuards(AuthGuard('jwt'))
    async getUserAvatar(
        @Req() req: IReqInfo,
        @Res() res: Response
    ) {
        const stream = await this.userProfileService.getUserAvatar(req.user)

        if (!stream) {
            throw new NotFoundException('Фото профиля не найдено')
        }

        res.contentType('image/webp')

        return stream.pipe(res)
    }

    @Delete('delete-avatar')
    @UseGuards(AuthGuard('jwt'))
    deleteAvatar(
        @Req() req: IReqInfo,
    ): Promise<{ message: string }> {
        return this.userProfileService.deleteAvatar(req.user)
    }
}