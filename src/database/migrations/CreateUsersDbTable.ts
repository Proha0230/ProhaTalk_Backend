// import { MigrationInterface, QueryRunner, Table } from 'typeorm'
//
// // нужен свежий таймстемпт в названии
// export class CreateUsersDbTable1777991875000 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'users_db',
//         columns: [
//           {
//             name: 'id', // название столбца
//             type: 'int', // тип данных
//             isPrimary: true, // является ли столбец ключом для поиска в таблицу и тд
//             isGenerated: true, // автогенерация
//             generationStrategy: 'increment', // как будет генерироваться ключ
//             isNullable: false, // не может быть null
//           },
//           {
//             name: 'email',
//             type: 'varchar',
//             length: '255',
//             isNullable: false,
//             isUnique: true,
//           },
//           {
//             name: 'login',
//             type: 'varchar',
//             length: '255',
//             isNullable: false,
//             isUnique: true,
//           },
//           {
//             name: 'password',
//             type: 'varchar',
//             length: '255',
//             isNullable: false,
//           }
//         ],
//       }),
//       true // если не существует таблицы то создать, если существует то ничего не делать
//     )
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('users_db')
//   }
// }
