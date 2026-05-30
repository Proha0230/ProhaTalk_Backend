import { Body, Controller, Post, Get, Headers, BadRequestException, UseGuards, Req, Res } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import { RequestResponseService } from "./request-response.service"
import { InviteFriendDTO } from "../../../DTO/friends/friends.dto"
import type { IReqInfo } from "../../../../global-types/types"

@Controller('api/invite-friend')
export class RequestResponseController {
    constructor(private readonly requestResponseService: RequestResponseService) {}

    @Post('send')
    @UseGuards(AuthGuard('jwt'))
    sendInviteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.sendInviteFriend(dto, req.user)
    }

    @Post('cancel')
    @UseGuards(AuthGuard('jwt'))
    cancelInviteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.cancelInviteFriend(dto, req.user)
    }

    @Post('decline')
    @UseGuards(AuthGuard('jwt'))
    approveInviteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.declineInviteFriend(dto, req.user)
    }

    @Post('accept')
    @UseGuards(AuthGuard('jwt'))
    acceptInviteFriend(
        @Body() dto: InviteFriendDTO,
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.acceptInviteFriend(dto, req.user)
    }

    // получаем список кому мы отправили заявку на добавление в контакты (исходящие)
    @Get('get-outgoing-requests')
    @UseGuards(AuthGuard('jwt'))
    getOutgoingRequests(
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.getOutgoingRequests(req.user)
    }

    // получаем список кто нас добавил в контакты (входящие)
    @Get('get-incoming-requests')
    @UseGuards(AuthGuard('jwt'))
    getIncomingRequests(
        @Req() req: IReqInfo
    ) {
        return this.requestResponseService.getIncomingRequests(req.user)
    }
}