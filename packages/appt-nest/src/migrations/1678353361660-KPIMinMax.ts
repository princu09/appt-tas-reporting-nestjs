import { MigrationInterface, QueryRunner } from 'typeorm';

export class KPIMinMax1678353361660 implements MigrationInterface {
  name = 'KPIMinMax1678353361660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMin" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMax" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMin" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMax" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMin" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMax" integer NOT NULL DEFAULT '100'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMax"`);
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMin"`);
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMax"`);
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMin"`);
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMax"`);
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMin"`);
  }
}
