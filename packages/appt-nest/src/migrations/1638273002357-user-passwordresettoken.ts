import { MigrationInterface, QueryRunner } from 'typeorm';

export class userPasswordresettoken1638273002357 implements MigrationInterface {
  name = 'userPasswordresettoken1638273002357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetToken" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying(255)`,
    );
  }
}
