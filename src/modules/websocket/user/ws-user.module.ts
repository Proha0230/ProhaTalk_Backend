import { Module } from '@nestjs/common'
import { WsUserGateway } from "./ws-user.gateway"
import { WsUserService } from "./ws-user.service"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { ChatsModule } from "../../user/chats/chats.module"

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '7d',
                }
            })
        }),
        // импортируем модуль с чатами
        ChatsModule
    ],
    providers: [WsUserGateway, WsUserService]
})
export class WsUserModule {}