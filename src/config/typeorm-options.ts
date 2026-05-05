import { ConfigService } from '@nestjs/config'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

type BaseMysqlOptions = Pick<
  MysqlConnectionOptions,
  | 'type'
  | 'host'
  | 'port'
  | 'username'
  | 'password'
  | 'database'
  | 'synchronize'
  | 'charset'
  | 'migrationsTableName'
>

function createTypeormBaseOptions(configValues: Omit<BaseMysqlOptions, 'type' | 'synchronize' | 'charset' | 'migrationsTableName'>): BaseMysqlOptions {
  return {
    type: 'mysql',
    host: configValues.host,
    port: configValues.port,
    username: configValues.username,
    password: configValues.password,
    database: configValues.database,
    synchronize: false,
    charset: 'utf8mb4',
    migrationsTableName: 'typeorm_migrations',
  }
}

export function createTypeormOptionsFromConfigService(configService: ConfigService): BaseMysqlOptions {
  return createTypeormBaseOptions({
    host: configService.get<string>('HOST_DB'),
    port: configService.get<number>('PORT_DB'),
    username: configService.get<string>('USERNAME_DB'),
    password: configService.get<string>('PASSWORD_DB'),
    database: configService.get<string>('DATABASE_DB'),
  })
}

export function createTypeormOptionsFromEnv(): BaseMysqlOptions {
  return createTypeormBaseOptions({
    host: process.env.HOST_DB,
    port: Number(process.env.PORT_DB),
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
  })
}
