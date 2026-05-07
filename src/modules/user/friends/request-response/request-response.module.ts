import { Module } from '@nestjs/common'
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RequestResponseService } from "./request-response.service"
import { RequestResponseController } from "./request-response.controller"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB,
            FriendsUsersDB,
            FriendsRequestsDB
        ])
    ],
    controllers: [RequestResponseController],
    providers: [RequestResponseService],
    exports: [RequestResponseService],
})
export class RequestResponseModule {}