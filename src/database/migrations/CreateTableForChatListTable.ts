// import { MigrationInterface, QueryRunner, Table } from 'typeorm'
//
// export class CreateTableForChatList1778587324000 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(
//             new Table({
//                 name: 'chats_list_db',
//
//                 columns: [
//                     {
//                         name: 'id',
//                         type: 'int',
//                         isPrimary: true,
//                         isGenerated: true,
//                         generationStrategy: 'increment',
//                     },
//
//                     // юзер первый кто состоит в чате
//                     {
//                         name: 'userOneId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     // юзер второй кто состоит в чате
//                     {
//                         name: 'userTwoId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     // таймстемпт создания таблицы
//                     {
//                         name: 'createdAt',
//                         type: 'timestamp',
//                         default: 'CURRENT_TIMESTAMP',
//                     }
//                 ],
//
//                 // устанавливаем связи
//                 // отправитель
//                 // @ManyToOne(() => UsersDB, {
//                 //     onDelete: 'CASCADE'
//                 // })
//                 //     @JoinColumn({ name: 'userOneId' })
//                 // userOne: UsersDB
//                 //
//                 // // получатель
//                 // @ManyToOne(() => UsersDB, {
//                 //     onDelete: 'CASCADE'
//                 // })
//                 //     @JoinColumn({ name: 'userTwoId' })
//                 // userTwo: UsersDB
//                 foreignKeys: [
//                     {
//                         columnNames: ['userOneId'],
//                         referencedTableName: 'users_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     },
//                     {
//                         columnNames: ['userTwoId'],
//                         referencedTableName: 'users_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     }
//                 ],
//
//                 // @Unique(['userOneId', 'userTwoId'])
//                 uniques: [
//                     {
//                         name: 'UQ_CHATS_RECORD',
//                         columnNames: ['userOneId', 'userTwoId']
//                     }
//                 ],
//
//                 // индексация столбцов смотри в entity
//                 // @Index()
//                 //     @Column({
//                 //         type: 'int',
//                 //     })
//                 // userOneId: number
//                 //
//                 // // юзер второй кто состоит в чате
//                 // @Index()
//                 //     @Column({
//                 //         type: 'int',
//                 //     })
//                 // userTwoId: number
//                 indices: [
//                     {
//                         name: 'IDX_CHAT_USER_ONE',
//                         columnNames: ['userOneId']
//                     },
//                     {
//                         name: 'IDX_CHAT_USER_TWO',
//                         columnNames: ['userTwoId']
//                     }
//                 ]
//             })
//         )
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropTable('chats_list_db')
//     }
// }