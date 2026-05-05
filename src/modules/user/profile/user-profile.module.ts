import { Module } from '@nestjs/common'
import { UsersDB } from "../../../database/entities/users/users-db.entity";
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserProfileService } from "./user-profile.service"
import { UserProfileController } from "./user-profile.controller"

@Module({
    imports: [TypeOrmModule.forFeature([UsersDB])],
    controllers: [UserProfileController],
    providers: [UserProfileService],
    exports: [UserProfileService],
})
export class UserProfileModule {}