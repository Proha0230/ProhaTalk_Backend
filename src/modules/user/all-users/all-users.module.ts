import { Module } from '@nestjs/common'
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FriendsUsersDB } from "../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../database/entities/friends/friends-request-db.entity"
import { AllUsersService } from "./all-users.service"
import { AllUsersController } from "./all-users.controller"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB,
            FriendsUsersDB,
            FriendsRequestsDB
        ])
    ],
    controllers: [AllUsersController],
    providers: [AllUsersService],
    exports: [AllUsersService],
})
export class AllUsersModule {}