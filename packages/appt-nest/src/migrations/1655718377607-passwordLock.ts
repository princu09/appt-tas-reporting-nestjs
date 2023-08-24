import { MigrationInterface, QueryRunner } from 'typeorm';

export class passwordLock1655718377607 implements MigrationInterface {
  name = 'passwordLock1655718377607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordLocked" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordAttempts" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordAttempts"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordLocked"`);
  }
}
