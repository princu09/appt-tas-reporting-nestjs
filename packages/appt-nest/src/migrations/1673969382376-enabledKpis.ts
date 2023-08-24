import { MigrationInterface, QueryRunner } from 'typeorm';

export class enabledKpis1673969382376 implements MigrationInterface {
  name = 'enabledKpis1673969382376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "enabledKPIs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "enabledKPIs" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "enabledKPIs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "enabledKPIs" text array`,
    );
  }
}
