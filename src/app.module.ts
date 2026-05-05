import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SignUpModule } from "./modules/sign-up/sign-up.module"
import { SignInModule } from "./modules/sign-in/sign-in.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"
import { loadEnvLocal } from "./config/load-env-local"
import { createTypeormOptionsFromConfigService } from "./config/typeorm-options"
import { UserProfileModule } from "./modules/user/profile/user-profile.module"

loadEnvLocal()

const configService = new ConfigService()
console.log(configService.get<string>('JWT_SECRET'), "configService.get<string>('JWT_SECRET')")

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
    UserProfileModule
  ]
})

export class AppModule {}
