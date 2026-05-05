// import { MigrationInterface, QueryRunner } from 'typeorm'
//
// // нужен свежий таймстемпт в названии
// export class AddColumnsFromUsersDb1777999469000 implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             'ALTER TABLE `users_db` ADD COLUMN `lastSeen` TIMESTAMP NULL',
//         )
//
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             "ALTER TABLE `users_db` ADD COLUMN `status` VARCHAR(80)",
//         )
//
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             'ALTER TABLE `users_db` ADD COLUMN `name` VARCHAR(20)',
//         )
//
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             'ALTER TABLE `users_db` ADD COLUMN `lastname` VARCHAR(20)',
//         )
//
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             'ALTER TABLE `users_db` ADD COLUMN `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
//         )
//
//         await queryRunner.query(
//             // добавляем столбец random в таблицу users_db
//             'ALTER TABLE `users_db` ADD COLUMN `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
//         )
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query('ALTER TABLE `users_db` DROP COLUMN `random`')
//     }
// }
