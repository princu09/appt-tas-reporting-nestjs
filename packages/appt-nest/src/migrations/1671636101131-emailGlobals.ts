import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailGlobals1671636101131 implements MigrationInterface {
  name = 'emailGlobals1671636101131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD "globalDefault" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP COLUMN "globalDefault"`,
    );
  }
}
