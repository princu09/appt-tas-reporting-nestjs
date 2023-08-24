import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganisationContractor1668607077478 implements MigrationInterface {
  name = 'OrganisationContractor1668607077478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organisationcontractor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" text NOT NULL, CONSTRAINT "PK_e0b466c9f1fce9b21499124bb71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationcontractor_users_user" ("organisationcontractorId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e1a7c08e72d4854a61423372e95" PRIMARY KEY ("organisationcontractorId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ba43ab32672fd515bc4ab50a5" ON "organisationcontractor_users_user" ("organisationcontractorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_282ad6e4c22dc0ac6b3c4cf1dc" ON "organisationcontractor_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" ADD CONSTRAINT "FK_7b8a9c40c183e7777508b8cd3fc" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" ADD CONSTRAINT "FK_8a74c82500e42c7e3401d9d7c78" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" ADD CONSTRAINT "FK_5d4237be68d69d6d1cecdf02b4c" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor_users_user" ADD CONSTRAINT "FK_7ba43ab32672fd515bc4ab50a5c" FOREIGN KEY ("organisationcontractorId") REFERENCES "organisationcontractor"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor_users_user" ADD CONSTRAINT "FK_282ad6e4c22dc0ac6b3c4cf1dc7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor_users_user" DROP CONSTRAINT "FK_282ad6e4c22dc0ac6b3c4cf1dc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor_users_user" DROP CONSTRAINT "FK_7ba43ab32672fd515bc4ab50a5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" DROP CONSTRAINT "FK_5d4237be68d69d6d1cecdf02b4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" DROP CONSTRAINT "FK_8a74c82500e42c7e3401d9d7c78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" DROP CONSTRAINT "FK_7b8a9c40c183e7777508b8cd3fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_282ad6e4c22dc0ac6b3c4cf1dc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ba43ab32672fd515bc4ab50a5"`,
    );
    await queryRunner.query(`DROP TABLE "organisationcontractor_users_user"`);
    await queryRunner.query(`DROP TABLE "organisationcontractor"`);
  }
}
