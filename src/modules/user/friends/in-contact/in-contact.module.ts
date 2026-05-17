import { Module } from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm"
import { FriendsUsersDB } from "../../../../database/entities/friends/friends-users-db.entity"
import { InContactService } from "./in-contact.service"
import { InContactController } from "./in-contact.controller"
import { UniversalModule } from "../../universal/universal.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FriendsUsersDB
        ]),
        UniversalModule
    ],
    controllers: [InContactController],
    providers: [InContactService],
    exports: [InContactService],
})
export class InContactModule {}