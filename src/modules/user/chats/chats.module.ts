import { Module } from '@nestjs/common'
import { UsersDB } from "../../../database/entities/users/users-db.entity";
import { TypeOrmModule } from "@nestjs/typeorm"
import { FriendsUsersDB } from "../../../database/entities/friends/friends-users-db.entity"
import { ChatsService } from "./chats.service"
import { ChatsController } from "./chats.controller"
import { ChatsListDB } from "../../../database/entities/chats/users-chats-list-db.entity"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"


@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB,
            FriendsUsersDB,
            ChatsListDB,
            MessagesDB
        ])
    ],
    controllers: [ChatsController],
    providers: [ChatsService],
    exports: [ChatsService],
})
export class ChatsModule {}