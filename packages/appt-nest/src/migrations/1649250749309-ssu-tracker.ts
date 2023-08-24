import { MigrationInterface, QueryRunner } from 'typeorm';

export class ssuTracker1649250749309 implements MigrationInterface {
  name = 'ssuTracker1649250749309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "selfSignUpProcessed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "selfSignUpProcessed"`,
    );
  }
}
