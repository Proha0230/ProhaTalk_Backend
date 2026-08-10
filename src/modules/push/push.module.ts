import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { PushSubscriptionDB } from "../../database/entities/push/push-subscriptions-db.entity"
import { UniversalModule } from "../user/universal/universal.module"
import { PushController } from "./push.controller"
import { PushService } from "./push.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PushSubscriptionDB
        ]),
        UniversalModule
    ],
    controllers: [PushController],
    providers: [PushService],
    exports: [PushService],
})
export class PushModule {}