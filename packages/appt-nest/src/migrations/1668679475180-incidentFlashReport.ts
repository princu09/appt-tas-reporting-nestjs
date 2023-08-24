import { MigrationInterface, QueryRunner } from 'typeorm';

export class incidentFlashReport1668679475180 implements MigrationInterface {
  name = 'incidentFlashReport1668679475180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "incidentflashreport" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "observed" TIMESTAMP, "description" text, "signature" boolean, "areaId" uuid, CONSTRAINT "REL_1395883739fa63d601e85c0aec" UNIQUE ("areaId"), CONSTRAINT "PK_ae293e92964ad73881978637484" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_73aabf798ceb741590a65d9f750" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_450e85dd4b11471cfa3b98cc5e9" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_f322d9ef877c74fe13e6118289e" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_1395883739fa63d601e85c0aeca" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_1395883739fa63d601e85c0aeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_f322d9ef877c74fe13e6118289e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_450e85dd4b11471cfa3b98cc5e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_73aabf798ceb741590a65d9f750"`,
    );
    await queryRunner.query(`DROP TABLE "incidentflashreport"`);
  }
}
