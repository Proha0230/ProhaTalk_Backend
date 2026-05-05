import { Module } from '@nestjs/common'
import { SignInService } from './sign-in.service'
import { SignInController } from './sign-in.controller'
import { UsersDB } from '../../database/entities/users/users-db.entity'
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersDB]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '7d',
                }
            })
        }),
    ],
    controllers: [SignInController],
    providers: [SignInService, JwtStrategy],
    exports: [SignInService],
})
export class SignInModule {}