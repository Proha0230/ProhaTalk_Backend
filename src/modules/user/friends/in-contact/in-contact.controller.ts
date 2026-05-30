import { Body, Controller, Delete, Get, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import type { IReqInfo } from "../../../../global-types/types"
import { InContactService } from "./in-contact.service"
import { IGetCurrentUserDTO } from "../../../DTO/all-users/all-users.dto"
import { IContactUser } from "./types"

@Controller('api/in-contact')
export class InContactController {
    constructor(private readonly inContactService: InContactService) {}

    @Delete('delete-user')
    @UseGuards(AuthGuard('jwt'))
    deleteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.inContactService.deleteFriend(dto, req.user)
    }

    @Get('get-list')
    @UseGuards(AuthGuard('jwt'))
    getContactsList(
        @Req() req: IReqInfo
    ): Promise<Array<IContactUser>> {
        return this.inContactService.getContactsList(req.user)
    }

    @Get('get-current-contact')
    @UseGuards(AuthGuard('jwt'))
    getCurrentContact(
        @Query() dto: IGetCurrentUserDTO,
        @Req() req: IReqInfo
    ): Promise<IContactUser> {
        return this.inContactService.getCurrentContact(dto, req.user)
    }
}