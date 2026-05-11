import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn } from 'typeorm'
import { UsersDB } from "../users/users-db.entity"
import { ChatsListDB } from "./users-chats-list-db.entity"

@Entity({ name: 'messages_db' })

export class MessagesDB {
    @PrimaryGeneratedColumn()
    id: number

    // id чата
    @Index()
    @Column({
        type: 'int'
    })
    conversationId: number

    // юзер который написал сообщение
    @Index()
    @Column({
        type: 'int',
    })
    senderId: number

    // текстовой контент сообщения
    @Column({
        type: 'text',
    })
    text: string

    // отправитель
    @ManyToOne(() => UsersDB, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'senderId' })
    sender: UsersDB

    // айдишник таблицы
    @ManyToOne(() => ChatsListDB, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'conversationId' })
    conversation: ChatsListDB

    // дата создания сообщения
    @CreateDateColumn()
    createdAt: Date
}