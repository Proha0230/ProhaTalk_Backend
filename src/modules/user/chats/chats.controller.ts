import { Body, Controller, Delete, Get, Headers, UseGuards, Req, Query, Res, Post } from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo, IResponseMessage } from "../../../global-types/types"
import { ChatsService } from "./chats.service"
import { ChatsMessageSendDto } from "../../DTO/chats/chats-send.dto"
import {IChatsUser, IMassagesForChatUser} from "./types";
import { ChatsGetListMessagesDto } from "../../DTO/chats/chats-get-list-messages.dto"

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Post('/message-send')
    @UseGuards(AuthGuard('jwt'))
    messageSend(
        @Body() dto: ChatsMessageSendDto,
        @Req() req: IReqInfo
    ): Promise<IResponseMessage> {
        return this.chatsService.messageSend(dto, req.user)
    }

    @Get('/get-list')
    @UseGuards(AuthGuard('jwt'))
    getChatsList(
        @Req() req: IReqInfo
    ): Promise<Array<IChatsUser>> {
        return this.chatsService.getChatsList(req.user)
    }

    @Get('/get-list-messages')
    @UseGuards(AuthGuard('jwt'))
    getChatsListMessages(
        @Query() dto: ChatsGetListMessagesDto,
        @Req() req: IReqInfo
    ): Promise<IMassagesForChatUser> {
        return this.chatsService.getChatsListMessages(req.user, dto)
    }
}