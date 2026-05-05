// import { MigrationInterface, QueryRunner } from 'typeorm'
//
// // нужен свежий таймстемпт в названии
// export class DropRandomColumnFromUsersDb1777993200000 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query('ALTER TABLE `users_db` DROP COLUMN `random`')
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       'ALTER TABLE `users_db` ADD COLUMN `random` varchar(255) NOT NULL',
//     )
//   }
// }
