import { Module } from '@nestjs/common'
import { UsersDB } from "../../../database/entities/users/users-db.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AllUsersService } from "./all-users.service"
import { AllUsersController } from "./all-users.controller"
import { UniversalModule } from "../universal/universal.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersDB
        ]),
        UniversalModule
    ],
    controllers: [AllUsersController],
    providers: [AllUsersService],
    exports: [AllUsersService],
})
export class AllUsersModule {}