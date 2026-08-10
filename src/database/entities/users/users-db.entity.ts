import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { PushSubscriptionDB } from "../push/push-subscriptions-db.entity"

@Entity({ name: 'users_db' })
export class UsersDB {
    // id уникальный
    @PrimaryGeneratedColumn()
    id: number


    // email уникальный
    @Column({
        unique: true, // уникальный
        type: 'varchar', // строка переменной длины
        length: 255, // максимум 255 символов
    })
    email: string


    // login уникальный
    @Column({
        unique: true,
        type: 'varchar',
        length: 255,
    })
    login: string


    // password
    @Column({
        type: 'varchar',
        length: 255,
    })
    password: string


    // согласился с правилами
    @Column({
        type: 'boolean'
    })
    acceptedTheTerms: boolean


    // последнее посещение
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    lastSeen: Date


    // статус
    @Column({
        type: 'varchar',
        length: 80,
        nullable: true
    })
    status: string | null


    // Имя
    @Column({
        type: 'varchar',
        length: 20,
        nullable: true
    })
    name: string | null

    // Фамилия
    @Column({
        type: 'varchar',
        length: 20,
        nullable: true
    })
    lastname: string | null

    // названия файла аватара
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        default: null
    })
    avatar: string | null

    @OneToMany(() => PushSubscriptionDB, pushSubscription => pushSubscription.user)
    pushSubscriptions: Array<PushSubscriptionDB>

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}