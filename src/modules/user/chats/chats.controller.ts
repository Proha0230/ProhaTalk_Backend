import { Body, Controller, Get, UseGuards, Req,
    Query, Res, Post, UseInterceptors,
    UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator
} from '@nestjs/common'
import { AuthGuard } from "@nestjs/passport"
import type { IReqInfo, IResponseMessage } from "../../../global-types/types"
import { ChatsService } from "./chats.service"
import { ChatsSendTextMessageDto } from "../../DTO/chats/chats-send-text-message.dto"
import { IChatsUser, IMassagesForChatUser } from "./types"
import { ChatsGetListMessagesDto } from "../../DTO/chats/chats-get-list-messages.dto"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"
import { FileInterceptor } from "@nestjs/platform-express"
import { ChatsGetVoiceMessageDto } from "../../DTO/chats/chats-get-voice-message.dto"
import type { Response } from "express"

@Controller('api/chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Post('/message-send')
    @UseGuards(AuthGuard('jwt'))
    messageTextSend(
        @Body() dto: ChatsSendTextMessageDto,
        @Req() req: IReqInfo
    ): Promise<IResponseMessage | MessagesDB> {
        return this.chatsService.messageTextSend(dto, req.user, false)
    }

    @Post('/message-voice')
    @UseGuards(AuthGuard('jwt'))
    // называем отправляемый файл в ForData 'avatar'
    @UseInterceptors(FileInterceptor('voice-message', {
        // максимум 7мб
        limits: {
            fileSize: 7 * 1024 * 1024
        }
    }))
    messageVoiceSend(
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
                validators: [
                    // поддерживаемые типы png/jpeg/jpg
                    new FileTypeValidator({
                        fileType: "webm"
                    }),
                    // максимум 7мб
                    new MaxFileSizeValidator({
                        maxSize: 7 * 1024 * 1024,
                    })
                ]
            })
        ) voiceMessageFile: Express.Multer.File,
        @Body('id') userIDWhomSending: string,
        @Req() req: IReqInfo
    ) {
        return this.chatsService.messageVoiceSend(voiceMessageFile, req.user, userIDWhomSending)
    }

    @Get('/get-list')
    @UseGuards(AuthGuard('jwt'))
    getChatsList(
        @Req() req: IReqInfo
    ): Promise<Array<IChatsUser>> {
        return this.chatsService.getChatsList(req.user)
    }

    @Get('/get-voice-message')
    @UseGuards(AuthGuard('jwt'))
    async getVoiceMessage(
        @Req() req: IReqInfo,
        @Query() dto: ChatsGetVoiceMessageDto,
        @Res() res: Response
    ) {
        const stream = await this.chatsService.getVoiceMessage(req.user, dto.voice, dto.uS)

        res.contentType('audio/webm')

        return stream.pipe(res)
    }

    @Get('/get-list-messages')
    @UseGuards(AuthGuard('jwt'))
    getChatsListMessages(
        @Query() dto: ChatsGetListMessagesDto,
        @Req() req: IReqInfo
    ): Promise<IMassagesForChatUser> {
        return this.chatsService.getChatsListMessages(req.user, dto)
    }

    //TODO добавить удаление чата и проверить почему его нет до сих пор
}