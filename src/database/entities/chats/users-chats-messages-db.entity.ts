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
        type: 'int'
    })
    senderId: number

    // текстовой контент сообщения
    @Column({
        type: 'text'
    })
    valueMessage: string

    @Column({
        type: 'boolean'
    })
    isText: boolean

    @Column({
        type: 'boolean'
    })
    isAudio: boolean

    @Column({
        type: 'boolean'
    })
    isPicture: boolean

    // айдишник таблицы many messages -> one chat
    @ManyToOne(() => ChatsListDB, (chatsListDb) => chatsListDb.id, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'conversationId' })
    conversation: ChatsListDB

    // отправитель
    @ManyToOne(() => UsersDB, (usersDB) => usersDB.id, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'senderId' })
    sender: UsersDB

    // дата создания сообщения
    @CreateDateColumn()
    createdAt: Date
}