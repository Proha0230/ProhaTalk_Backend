import {Body, Controller, Post, Get, Headers, BadRequestException, UseGuards, Req} from '@nestjs/common'
import { UserProfileService } from './user-profile.service'
import { UserProfileDto } from "../../DTO/user/profile/user-profile.dto"
import { AuthGuard } from "@nestjs/passport"

@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Post('change-info')
    @UseGuards(AuthGuard('jwt'))
    changeInfo(
        @Body() dto: UserProfileDto,
        @Req() req: { login: string, id: number}
    ): Promise<{ message: string }> {
        return this.userProfileService.changeInfo(dto, req)
    }

}