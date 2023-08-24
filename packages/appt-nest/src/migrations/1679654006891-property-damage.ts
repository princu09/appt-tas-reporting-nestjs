import { MigrationInterface, QueryRunner } from 'typeorm';

export class propertyDamage1679654006891 implements MigrationInterface {
  name = 'propertyDamage1679654006891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOfPropertyDamagedEvents" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOfPropertyDamagedEvents"`,
    );
  }
}
