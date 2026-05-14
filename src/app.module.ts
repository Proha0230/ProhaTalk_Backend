import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SignUpModule } from "./modules/sign-up/sign-up.module"
import { SignInModule } from "./modules/sign-in/sign-in.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"
import { loadEnvLocal } from "./config/load-env-local"
import { createTypeormOptionsFromConfigService } from "./config/typeorm-options"
import { UserProfileModule } from "./modules/user/profile/user-profile.module"
import { RequestResponseModule } from "./modules/user/friends/request-response/request-response.module"
import { InContactModule } from "./modules/user/friends/in-contact/in-contact.module"
import { AllUsersModule } from "./modules/user/all-users/all-users.module"
import { ChatsModule } from "./modules/user/chats/chats.module"
import { WsUserModule } from "./modules/websocket/user/ws-user.module"

loadEnvLocal()

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...createTypeormOptionsFromConfigService(configService),
        autoLoadEntities: true,
        legacySpatialSupport: false,
        migrations: [join(__dirname, 'database', 'migrations', '*.{ts,js}')],
      })
    }),
    SignUpModule,
    SignInModule,
    UserProfileModule,
    RequestResponseModule,
    InContactModule,
    AllUsersModule,
    ChatsModule,
    WsUserModule
  ]
})

export class AppModule {}
