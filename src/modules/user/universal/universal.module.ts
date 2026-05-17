import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { UniversalService } from "./universal.service"
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { FriendsRequestsDB } from "../../../database/entities/friends/friends-request-db.entity"
import { FriendsUsersDB } from "../../../database/entities/friends/friends-users-db.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB,
            FriendsRequestsDB,
            FriendsUsersDB
        ])
    ],
    providers: [UniversalService],
    exports: [UniversalService]
})
export class UniversalModule {}