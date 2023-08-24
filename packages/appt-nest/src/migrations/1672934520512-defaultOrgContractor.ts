import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultOrgContractor1672934520512 implements MigrationInterface {
  name = 'defaultOrgContractor1672934520512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" ADD "default" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisationcontractor" DROP COLUMN "default"`,
    );
  }
}
