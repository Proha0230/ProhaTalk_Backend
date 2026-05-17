import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { RequestResponseService } from "./request-response.service"
import { RequestResponseController } from "./request-response.controller"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { UniversalModule } from "../../universal/universal.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FriendsUsersDB,
            FriendsRequestsDB
        ]),
        UniversalModule
    ],
    controllers: [RequestResponseController],
    providers: [RequestResponseService],
    exports: [RequestResponseService],
})
export class RequestResponseModule {}