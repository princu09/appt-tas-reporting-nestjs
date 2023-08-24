import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultOrgsMinValues1685972155356 implements MigrationInterface {
  name = 'defaultOrgsMinValues1685972155356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMin" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMax" SET DEFAULT '2.7'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMin" SET DEFAULT '0'`,
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
  }
}
