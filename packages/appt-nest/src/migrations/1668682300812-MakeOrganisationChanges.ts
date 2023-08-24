import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeOrganisationChanges1668682300812
  implements MigrationInterface
{
  name = 'MakeOrganisationChanges1668682300812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "projectNumber" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "projectLocation" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "projectStartDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "projectEndDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "projectPhase" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "enabledKPIs" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "projectPhase"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "projectEndDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "projectStartDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "projectLocation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "projectNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "enabledKPIs"`,
    );
  }
}
