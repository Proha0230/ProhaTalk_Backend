import {Body, Controller, Post, Get, Headers, BadRequestException, UseGuards, Req} from '@nestjs/common'
import { UserProfileService } from './user-profile.service'
import { UserProfileDto } from "../../DTO/user/profile/user-profile.dto"
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo } from "../../../global-types/types"

@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

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

}