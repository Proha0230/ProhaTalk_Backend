import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn, OneToMany } from 'typeorm'
import { UsersDB } from "../users/users-db.entity"
import { MessagesDB } from "./users-chats-messages-db.entity"

@Entity({ name: 'chats_list_db' })
// нельзя отправить одну и ту же заявку дважды
@Unique(['userOneId', 'userTwoId'])

export class ChatsListDB {
    @PrimaryGeneratedColumn()
    id: number

    // юзер первый кто состоит в чате
    @Index()
    @Column({
        type: 'int',
    })
    userOneId: number

    // юзер второй кто состоит в чате
    @Index()
    @Column({
        type: 'int',
    })
    userTwoId: number

    // отправитель
    @ManyToOne(() => UsersDB, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userOneId' })
    userOne: UsersDB

    // получатель
    @ManyToOne(() => UsersDB, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userTwoId' })
    userTwo: UsersDB

    // one chat -> many messages
    // связь хранится в поле conversation внутри MessagesDB
    @OneToMany(() => MessagesDB, message => message.conversation)
    messages: MessagesDB[]
    // ChatsListDB.messages
    // ↕
    // MessagesDB.conversation

    // теперь можно будет сделать так
    // const chat = await chatsRepo.findOne({
    //     where: { id: 1 },
    //     relations: {
    //         messages: true
    //     }
    // })

    // дата создания таблицы
    @CreateDateColumn()
    createdAt: Date
}