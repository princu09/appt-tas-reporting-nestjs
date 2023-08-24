import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailTemplateRecord1643121209932 implements MigrationInterface {
  name = 'emailTemplateRecord1643121209932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email-template-attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recordId" uuid, "emailTemplateId" uuid, CONSTRAINT "REL_dc8ba142fcf626b5a0dcc3d3fc" UNIQUE ("recordId"), CONSTRAINT "PK_97babaf49c2868a17842166bd07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" ADD "templateId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" ADD CONSTRAINT "UQ_cc61ee0a405382aa609e573b6b3" UNIQUE ("templateId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_9e35c6f800edb17c91453867abf" FOREIGN KEY ("emailTemplateId") REFERENCES "email-template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" ADD CONSTRAINT "FK_cc61ee0a405382aa609e573b6b3" FOREIGN KEY ("templateId") REFERENCES "email-template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" DROP CONSTRAINT "FK_cc61ee0a405382aa609e573b6b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_9e35c6f800edb17c91453867abf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" DROP CONSTRAINT "UQ_cc61ee0a405382aa609e573b6b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-trigger-delayed" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(`DROP TABLE "email-template-attachments"`);
  }
}
