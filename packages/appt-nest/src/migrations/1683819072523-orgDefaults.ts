import { MigrationInterface, QueryRunner } from 'typeorm';

export class orgDefaults1683819072523 implements MigrationInterface {
  name = 'orgDefaults1683819072523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMin" numeric(10,2) NOT NULL DEFAULT '0.41'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMax" numeric(10,2) NOT NULL DEFAULT '2.7'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMin" numeric(10,2) NOT NULL DEFAULT '1.8'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMax" numeric(10,2) NOT NULL DEFAULT '3.5'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMin" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMax" numeric(10,2) NOT NULL DEFAULT '1.5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMax" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "DARTMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "DARTMin" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMax" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "TRIRMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "TRIRMin" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMax"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMax" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "LTIRMin"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "LTIRMin" integer NOT NULL DEFAULT '0'`,
    );
  }
}
