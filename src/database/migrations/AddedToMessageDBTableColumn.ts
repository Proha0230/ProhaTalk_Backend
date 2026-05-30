// import { MigrationInterface, QueryRunner } from 'typeorm'
//
// export class AddUserAvatarColumn1779999999999
//     implements MigrationInterface
// {
//     public async up(
//         queryRunner: QueryRunner,
//     ): Promise<void> {
//
//         await queryRunner.query(`
//             ALTER TABLE users_db
//             ADD COLUMN avatar VARCHAR(255)
//             DEFAULT NULL
//         `)
//
//         // await queryRunner.query(`
//         //     ALTER TABLE messages_db
//         //     ADD COLUMN isAudio BOOLEAN
//         //     NOT NULL DEFAULT false
//         // `)
//         //
//         // await queryRunner.query(`
//         //     ALTER TABLE messages_db
//         //     ADD COLUMN isPicture BOOLEAN
//         //     NOT NULL DEFAULT false
//         // `)
//     }
//
//     public async down(
//         queryRunner: QueryRunner,
//     ): Promise<void> {
//
//         await queryRunner.query(`
//             ALTER TABLE users_db
//             DROP COLUMN avatar
//         `)
//
//         // await queryRunner.query(`
//         //     ALTER TABLE messages_db
//         //     DROP COLUMN isAudio
//         // `)
//         //
//         // await queryRunner.query(`
//         //     ALTER TABLE messages_db
//         //     DROP COLUMN isPicture
//         // `)
//     }
// }