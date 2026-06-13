import { DataSource } from 'typeorm'
import { UsersDB } from './entities/users/users-db.entity'
import { loadEnvLocal } from '../config/load-env-local'
import { createTypeormOptionsFromEnv } from '../config/typeorm-options'

// загружаем ключи из .env
loadEnvLocal()

// для выполнения миграций
export default new DataSource({
  ...createTypeormOptionsFromEnv(),
  entities: [UsersDB],
  migrations: ['src/database/migrations/*.{ts,js}']
})