import { MigrationInterface, QueryRunner } from 'typeorm';

export class stuff1643903871851 implements MigrationInterface {
  name = 'stuff1643903871851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_8836431f1a84efaa34e8eaba5cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_44344bc926ffbcb4991bd820291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_6c23f63eba2dff318446816c517"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" RENAME COLUMN "template" TO "templateId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationemailtemplate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "html" text NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_0121e35b0b029fa85352a72ef6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "senderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "targetOrganisationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "targetSiteId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "permissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "timeToSend"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "inviteTemplateId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "from" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "templateId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD "templateId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "data" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" ADD CONSTRAINT "FK_6bc031c9658dc8b4400bf43e208" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" ADD CONSTRAINT "FK_50a4e7dab17296da05d87a4b178" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" ADD CONSTRAINT "FK_2d8238a0194ce58b2701f32dc2a" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "FK_1e5bc4ca54583117d61899ff231" FOREIGN KEY ("inviteTemplateId") REFERENCES "organisationemailtemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD CONSTRAINT "FK_e1c6cf9ca257f995cffb728d36a" FOREIGN KEY ("templateId") REFERENCES "organisationemailtemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_11fb817c4c06fd5b1b07a83e185" FOREIGN KEY ("templateId") REFERENCES "organisationemailtemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_11fb817c4c06fd5b1b07a83e185"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP CONSTRAINT "FK_e1c6cf9ca257f995cffb728d36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "FK_1e5bc4ca54583117d61899ff231"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" DROP CONSTRAINT "FK_2d8238a0194ce58b2701f32dc2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" DROP CONSTRAINT "FK_50a4e7dab17296da05d87a4b178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationemailtemplate" DROP CONSTRAINT "FK_6bc031c9658dc8b4400bf43e208"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "data" text`);
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD "templateId" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "from"`);
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "inviteTemplateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "timeToSend" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "permissionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "targetSiteId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "targetOrganisationId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "notification" ADD "senderId" uuid`);
    await queryRunner.query(`DROP TABLE "organisationemailtemplate"`);
    await queryRunner.query(
      `ALTER TABLE "email-template" RENAME COLUMN "templateId" TO "template"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_6c23f63eba2dff318446816c517" FOREIGN KEY ("permissionId") REFERENCES "notification_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_44344bc926ffbcb4991bd820291" FOREIGN KEY ("targetSiteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_8836431f1a84efaa34e8eaba5cb" FOREIGN KEY ("targetOrganisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
