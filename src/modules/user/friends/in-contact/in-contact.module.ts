import { Module } from '@nestjs/common'
import { UsersDB } from "../../../../database/entities/users/users-db.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { FriendsRequestsDB } from "../../../../database/entities/friends/friends-request-db.entity"
import { InContactService } from "./in-contact.service"
import { InContactController } from "./in-contact.controller"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB,
            FriendsUsersDB,
            FriendsRequestsDB
        ])
    ],
    controllers: [InContactController],
    providers: [InContactService],
    exports: [InContactService],
})
export class InContactModule {}