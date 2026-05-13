// import { MigrationInterface, QueryRunner, Table } from 'typeorm'
//
// export class CreateTableForChatsMessage1779587324000 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(
//             new Table({
//                 name: 'messages_db',
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
//                     // id чата пользователя с пользователем
//                     {
//                         name: 'conversationId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     // юзер кто написал сообщение
//                     {
//                         name: 'senderId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     // value сообщения
//                     {
//                         name: 'valueMessage',
//                         type: 'text',
//                         isNullable: false,
//                     },
//
//                     // таймстемпт когда было отправлено сообщение
//                     {
//                         name: 'createdAt',
//                         type: 'timestamp',
//                         default: 'CURRENT_TIMESTAMP',
//                     }
//                 ],
//
//                 // // айдишник таблицы many messages -> one chat
//                 // @ManyToOne(() => ChatsListDB, {
//                 //     onDelete: 'CASCADE'
//                 // })
//                 //     @JoinColumn({ name: 'conversationId' })
//                 // conversation: ChatsListDB
//                 //
//                 // // отправитель
//                 // @ManyToOne(() => UsersDB, {
//                 //     onDelete: 'CASCADE'
//                 // })
//                 //     @JoinColumn({ name: 'senderId' })
//                 // sender: UsersDB
//                 //
//                 // устанавливаем связи
//                 foreignKeys: [
//                     {
//                         columnNames: ['conversationId'],
//                         referencedTableName: 'chats_list_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     },
//                     {
//                         columnNames: ['senderId'],
//                         referencedTableName: 'users_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     }
//                 ],
//
//                 // // id чата
//                 // @Index()
//                 //     @Column({
//                 //         type: 'int'
//                 //     })
//                 // conversationId: number
//                 //
//                 // // юзер который написал сообщение
//                 // @Index()
//                 //     @Column({
//                 //         type: 'int',
//                 //     })
//                 // senderId: number
//                 indices: [
//                     {
//                         name: 'IDX_MESSAGES_CONVERSATION',
//                         columnNames: ['conversationId']
//                     },
//                     {
//                         name: 'IDX_MESSAGES_SENDER',
//                         columnNames: ['senderId']
//                     }
//                 ]
//             })
//         )
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropTable('messages_db')
//     }
// }