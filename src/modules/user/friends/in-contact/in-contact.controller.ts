import { Body, Controller, Post, Get, Headers, UseGuards, Req, Res } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import type { IReqInfo } from "../../../../global-types/types"
import { InContactService } from "./in-contact.service"

@Controller('in-contact')
export class InContactController {
    constructor(private readonly inContactService: InContactService) {}

    @Post('delete-user')
    @UseGuards(AuthGuard('jwt'))
    deleteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.inContactService.deleteFriend(dto, req.user)
    }
}