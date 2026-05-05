import { Module } from '@nestjs/common'
import { SignUpService } from './sign-up.service'
import { SignUpController } from './sign-up.controller'
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersDB } from "../../database/entities/users/users-db.entity"

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersDB]),
    ],
    controllers: [SignUpController],
    providers: [SignUpService],
    exports: [SignUpService],
})
export class SignUpModule {}