import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailTemplatesAttachments1643215924174
  implements MigrationInterface
{
  name = 'emailTemplatesAttachments1643215924174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_9e35c6f800edb17c91453867abf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ALTER COLUMN "recordId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "REL_dc8ba142fcf626b5a0dcc3d3fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ALTER COLUMN "emailTemplateId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_9e35c6f800edb17c91453867abf" FOREIGN KEY ("emailTemplateId") REFERENCES "email-template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_9e35c6f800edb17c91453867abf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" DROP CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ALTER COLUMN "emailTemplateId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "REL_dc8ba142fcf626b5a0dcc3d3fc" UNIQUE ("recordId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ALTER COLUMN "recordId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_9e35c6f800edb17c91453867abf" FOREIGN KEY ("emailTemplateId") REFERENCES "email-template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email-template-attachments" ADD CONSTRAINT "FK_dc8ba142fcf626b5a0dcc3d3fc1" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
