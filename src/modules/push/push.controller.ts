import {Body, Controller, Delete, Post, Req, UseGuards} from "@nestjs/common"
import { PushService } from "./push.service"
import type { IReqInfo } from "../../global-types/types"
import { SubscribePushDTO } from "../DTO/push/push-subscribe.dto"
import { PushUnsubscribeDto } from "../DTO/push/push-unsubscribe.dto"
import { AuthGuard } from "@nestjs/passport"
import { UniversalService } from "../user/universal/universal.service"


@Controller('api/push')
export class PushController{
    constructor(
        private readonly pushService: PushService,
        private readonly universalService: UniversalService
    ){}

    @Post('test-push')
    @UseGuards(AuthGuard('jwt'))
    async testPush(
        @Req() req: IReqInfo,
        @Body() body: any
    ) {
        return await this.universalService.sendNotification(req.user, body)
    }

    @Post('subscribe')
    @UseGuards(AuthGuard('jwt'))
    async subscribePush(
        @Body() dto: SubscribePushDTO,
        @Req() req: IReqInfo
    ) {
        return await this.pushService.subscribePush(req.user, dto)
    }

    @Delete('unsubscribe')
    @UseGuards(AuthGuard('jwt'))
    async unsubscribePush(
        @Body() dto: PushUnsubscribeDto,
        @Req() req: IReqInfo
    ) {
        return await this.pushService.unsubscribePush(req.user, dto)
    }
}