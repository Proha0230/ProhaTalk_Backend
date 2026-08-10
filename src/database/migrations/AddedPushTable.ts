// import { MigrationInterface, QueryRunner } from 'typeorm'
//
// export class CreatePushSubscriptions1780000000000
//     implements MigrationInterface
// {
//     public async up(
//         queryRunner: QueryRunner,
//     ): Promise<void> {
//
//         await queryRunner.query(`
//             CREATE TABLE push_subscriptions_db (
//                 id VARCHAR(36) NOT NULL,
//
//                 endpoint VARCHAR(512) NOT NULL UNIQUE,
//
//                 p256dh TEXT NOT NULL,
//
//                 auth TEXT NOT NULL,
//
//                 userId INT NOT NULL,
//
//                 createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//
//                 PRIMARY KEY (id),
//
//                 INDEX idx_push_subscriptions_user_id (userId),
//
//                 CONSTRAINT fk_push_subscriptions_user
//                 FOREIGN KEY (userId)
//                 REFERENCES users_db(id)
//                 ON DELETE CASCADE
//             )
//         `)
//     }
//
//     public async down(
//         queryRunner: QueryRunner,
//     ): Promise<void> {
//
//         await queryRunner.query(`
//             DROP TABLE push_subscriptions
//         `)
//     }
// }