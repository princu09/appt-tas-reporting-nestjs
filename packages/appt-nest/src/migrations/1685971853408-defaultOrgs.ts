import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultOrgs1685971853408 implements MigrationInterface {
  name = 'defaultOrgs1685971853408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "kpiMultiplier" SET DEFAULT '1000000'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMin" SET DEFAULT '0.41'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMax" SET DEFAULT '2.7'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMin" SET DEFAULT '1.8'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMax" SET DEFAULT '3.5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "DARTMax" SET DEFAULT '1.5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "DARTMax" SET DEFAULT 1.5`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMax" SET DEFAULT 3.5`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMin" SET DEFAULT 1.8`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMax" SET DEFAULT 2.7`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMin" SET DEFAULT 0.41`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "kpiMultiplier" SET DEFAULT '100000'`,
    );
  }
}
