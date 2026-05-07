import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn } from 'typeorm'
import { UsersDB } from "../users/users-db.entity"

@Entity({ name: 'friends_users_db' })
// нельзя добавить одного и того же друга дважды
@Unique(['userId', 'friendId'])

export class FriendsUsersDB {
    @PrimaryGeneratedColumn()
    id: number

    // владелец дружбы
    @Index()
    @Column({
        type: 'int',
    })
    userId: number


    // его друг
    @Index()
    @Column({
        type: 'int',
    })
    friendId: number

    // пользователь
    @ManyToOne(() => UsersDB)
    @JoinColumn({ name: 'userId' })
    user: UsersDB // сюда подставится primaryKey по умолчанию из UsersDB т.е id


    // объект друга
    @ManyToOne(() => UsersDB)
    @JoinColumn({ name: 'friendId' })
    friend: UsersDB // сюда подставится primaryKey по умолчанию из UsersDB т.е id


    @CreateDateColumn()
    createdAt: Date

}