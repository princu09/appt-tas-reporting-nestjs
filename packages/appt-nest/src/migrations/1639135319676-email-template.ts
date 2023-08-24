import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailTemplate1639135319676 implements MigrationInterface {
  name = 'emailTemplate1639135319676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email-template-trigger-delayed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" jsonb NOT NULL, "timeToSend" TIMESTAMP NOT NULL, CONSTRAINT "PK_1f0bd746c4cc38831a657ae0bff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email-template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "fromAddress" text NOT NULL, "subject" text NOT NULL, "template" text NOT NULL, "CC" text, "BCC" text, "content" text, "triggers" text array, "delayMinutes" integer, CONSTRAINT "PK_85f62c144b7cc9f777168bf0093" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetToken" uuid`);
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD CONSTRAINT "FK_3454b5480155dc8f1666305c14e" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD CONSTRAINT "FK_2277f1eb1f7bccddd5ddc3de6e6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD CONSTRAINT "FK_275bc16a2e6a0c6e638c5c2348e" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP CONSTRAINT "FK_275bc16a2e6a0c6e638c5c2348e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP CONSTRAINT "FK_2277f1eb1f7bccddd5ddc3de6e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP CONSTRAINT "FK_3454b5480155dc8f1666305c14e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying(255)`,
    );
    await queryRunner.query(`DROP TABLE "email-template"`);
    await queryRunner.query(`DROP TABLE "email-template-trigger-delayed"`);
  }
}
