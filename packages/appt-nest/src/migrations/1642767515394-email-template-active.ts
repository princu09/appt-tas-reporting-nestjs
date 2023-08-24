import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailTemplateActive1642767515394 implements MigrationInterface {
  name = 'emailTemplateActive1642767515394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD "active" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" DROP COLUMN "active"`,
    );
  }
}
