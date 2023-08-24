import { MigrationInterface, QueryRunner } from 'typeorm';

export class emailTemplateTitle1643217509790 implements MigrationInterface {
  name = 'emailTemplateTitle1643217509790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "email-template" ADD "title" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email-template" DROP COLUMN "title"`);
  }
}
