import { MigrationInterface, QueryRunner } from 'typeorm';

export class orglogo1673009935022 implements MigrationInterface {
  name = 'orglogo1673009935022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" RENAME COLUMN "logourl" TO "logoId"`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "logoId"`);
    await queryRunner.query(`ALTER TABLE "organisation" ADD "logoId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "UQ_db18c986401a00cbe7e2e930448" UNIQUE ("logoId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "FK_db18c986401a00cbe7e2e930448" FOREIGN KEY ("logoId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "FK_db18c986401a00cbe7e2e930448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "UQ_db18c986401a00cbe7e2e930448"`,
    );
    await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "logoId"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "logoId" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" RENAME COLUMN "logoId" TO "logourl"`,
    );
  }
}
