import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn } from 'typeorm'
import { UsersDB } from "../users/users-db.entity"

@Entity({ name: 'friends_requests_db' })
// нельзя отправить одну и ту же заявку дважды
@Unique(['senderId', 'receiverId'])

export class FriendsRequestsDB {
    @PrimaryGeneratedColumn()
    id: number

    // кто отправил заявку
    @Index()
    @Column({
        type: 'int',
    })
    senderId: number

    // кому отправили заявку
    @Index()
    @Column({
        type: 'int',
    })
    receiverId: number

    // отправитель
    @ManyToOne(() => UsersDB, (usersDB) => usersDB.id)
    @JoinColumn({ name: 'senderId' })
    sender: UsersDB

    // получатель
    @ManyToOne(() => UsersDB, (usersDB) => usersDB.id)
    @JoinColumn({ name: 'receiverId' })
    receiver: UsersDB

    @CreateDateColumn()
    createdAt: Date
}