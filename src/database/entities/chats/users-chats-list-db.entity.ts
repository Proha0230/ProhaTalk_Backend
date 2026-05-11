import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn } from 'typeorm'
import { UsersDB } from "../users/users-db.entity"

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
    @ManyToOne(() => UsersDB)
    @JoinColumn({ name: 'userOneId' })
    userOne: UsersDB

    // получатель
    @ManyToOne(() => UsersDB)
    @JoinColumn({ name: 'userTwoId' })
    userTwo: UsersDB

    // дата создания таблицы
    @CreateDateColumn()
    createdAt: Date
}