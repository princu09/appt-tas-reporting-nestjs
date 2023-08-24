import { MigrationInterface, QueryRunner } from 'typeorm';

export class questionaire1644398979891 implements MigrationInterface {
  name = 'questionaire1644398979891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "Errored" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD "LastSent" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP COLUMN "LastSent"`,
    );
    await queryRunner.query(`ALTER TABLE "questionaire" DROP COLUMN "Errored"`);
  }
}
