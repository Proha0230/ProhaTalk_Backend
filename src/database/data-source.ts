import { DataSource } from 'typeorm'
import { UsersDB } from './entities/users/users-db.entity'
import { loadEnvLocal } from '../config/load-env-local'
import { createTypeormOptionsFromEnv } from '../config/typeorm-options'
import { PushSubscriptionDB } from "./entities/push/push-subscriptions-db.entity"
import { FriendsRequestsDB } from "./entities/friends/friends-request-db.entity"
import { FriendsUsersDB } from "./entities/friends/friends-users-db.entity"
import { ChatsListDB } from "./entities/chats/users-chats-list-db.entity"
import { MessagesDB } from "./entities/chats/users-chats-messages-db.entity"

// загружаем ключи из .env
loadEnvLocal()

// для выполнения миграций
export default new DataSource({
  ...createTypeormOptionsFromEnv(),
  entities: [UsersDB, PushSubscriptionDB, FriendsRequestsDB, FriendsUsersDB, ChatsListDB, MessagesDB],
  migrations: ['src/database/migrations/*.{ts,js}']
})