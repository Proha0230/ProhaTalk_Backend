import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UsersDB } from "../users/users-db.entity"

@Entity({ name: 'push_subscriptions' })
export class PushSubscriptionDB {
    // uuid будет генерироваться типо таким:
    // 550e8400-e29b-41d4-a716-446655440000
    // a3a14d0b-2f4c-4f4d-8c5b-8c8f7e8d9a1b
    // f3f4fdf1-9c0c-4d7f-95e0-0fddf6f4fcb3
    @PrimaryGeneratedColumn('uuid')
    id: string

    // Это адрес устройства в push-сервисе. Пример - https://fcm.googleapis.com/fcm/send/ejHk9...
    @Column({
        type: 'varchar',
        length: 512,
        unique: true
    })
    endpoint: string

    // Это публичный ключ устройства. Используется для шифрования сообщения. Библиотека шифрует данные именно этим ключом.
    @Column('text')
    p256dh: string

    // Дополнительный секретный ключ аутентификации.
    // Нужен для проверки, что сообщение действительно предназначено именно этой подписке.
    @Column('text')
    auth: string

    // id юзера
    @Column()
    userId: number

    // связь с юзером
    @ManyToOne(() => UsersDB, user => user.pushSubscriptions, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId' })
    user: UsersDB

    // дата начала подписки
    @CreateDateColumn()
    createdAt: Date;
}