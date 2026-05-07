// import { MigrationInterface, QueryRunner, Table } from 'typeorm'
//
// export class CreateFriendsRequestsTable1779991875000
//     implements MigrationInterface
// {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(
//             new Table({
//                 name: 'friends_requests_db',
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
//                     // владелец дружбы
//                     {
//                         name: 'senderId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     // друг
//                     {
//                         name: 'receiverId',
//                         type: 'int',
//                         isNullable: false,
//                     },
//
//                     {
//                         name: 'createdAt',
//                         type: 'timestamp',
//                         default: 'CURRENT_TIMESTAMP',
//                     }
//                 ],
//
//                 // устанавливаем связи
//                 foreignKeys: [
//                     {
//                         columnNames: ['senderId'],
//                         referencedTableName: 'users_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     },
//                     {
//                         columnNames: ['receiverId'],
//                         referencedTableName: 'users_db',
//                         referencedColumnNames: ['id'],
//                         onDelete: 'CASCADE'
//                     }
//                 ],
//
//                 // UNIQUE(userId, friendId)
//                 uniques: [
//                     {
//                         name: 'UQ_FRIENDS_REQUESTS',
//                         columnNames: ['senderId', 'receiverId']
//                     }
//                 ]
//             })
//         )
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropTable('friends_requests_db')
//     }
// }