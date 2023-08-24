import { MigrationInterface, QueryRunner } from 'typeorm';

export class area1668614271805 implements MigrationInterface {
  name = 'area1668614271805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "area" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" text NOT NULL, CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "area" ADD CONSTRAINT "FK_d8e3217cb59577a122e8a269733" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "area" ADD CONSTRAINT "FK_47596fb510ca780215f6640ab12" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "area" ADD CONSTRAINT "FK_0ffb3c7d920028c9d7a75493ed8" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "area" DROP CONSTRAINT "FK_0ffb3c7d920028c9d7a75493ed8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "area" DROP CONSTRAINT "FK_47596fb510ca780215f6640ab12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "area" DROP CONSTRAINT "FK_d8e3217cb59577a122e8a269733"`,
    );
    await queryRunner.query(`DROP TABLE "area"`);
  }
}
