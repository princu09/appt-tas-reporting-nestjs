import { MigrationInterface, QueryRunner } from 'typeorm';

export class orgKpiMultiplier1673620825370 implements MigrationInterface {
  name = 'orgKpiMultiplier1673620825370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "kpiMultiplier" integer NOT NULL DEFAULT '100000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "kpiMultiplier"`,
    );
  }
}
