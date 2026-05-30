import { Module } from "@nestjs/common"
import { UniversalModule } from "../universal/universal.module"
import { UserService } from "./user.service"
import { UserController } from "./user.controller"


@Module({
    imports: [UniversalModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}