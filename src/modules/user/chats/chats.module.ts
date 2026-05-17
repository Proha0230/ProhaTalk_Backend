import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChatsService } from "./chats.service"
import { ChatsController } from "./chats.controller"
import { ChatsListDB } from "../../../database/entities/chats/users-chats-list-db.entity"
import { MessagesDB } from "../../../database/entities/chats/users-chats-messages-db.entity"
import { UniversalModule } from "../universal/universal.module"


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChatsListDB,
            MessagesDB
        ]),
        UniversalModule
    ],
    controllers: [ChatsController],
    providers: [ChatsService],
    exports: [ChatsService],
})
export class ChatsModule {}