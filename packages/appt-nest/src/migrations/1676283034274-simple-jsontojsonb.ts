import { MigrationInterface, QueryRunner } from 'typeorm';

export class simpleJsontojsonb1676283034274 implements MigrationInterface {
  name = 'simpleJsontojsonb1676283034274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "enabledKPIs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "enabledKPIs" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "enabledKPIs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "enabledKPIs" text`,
    );
  }
}
