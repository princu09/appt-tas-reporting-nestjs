import { MigrationInterface, QueryRunner } from 'typeorm';

export class knightsMortgageMilestonesChanges1642762996482
  implements MigrationInterface
{
  name = 'knightsMortgageMilestonesChanges1642762996482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_4ea753e7e75553ca68ca7e85a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "UQ_4ea753e7e75553ca68ca7e85a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP COLUMN "mortgageId"`,
    );
    await queryRunner.query(`ALTER TABLE "mortgage" ADD "milestonesId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "UQ_a197641ff3ca4859feaeb76ee9b" UNIQUE ("milestonesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_a197641ff3ca4859feaeb76ee9b" FOREIGN KEY ("milestonesId") REFERENCES "milestones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_a197641ff3ca4859feaeb76ee9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "UQ_a197641ff3ca4859feaeb76ee9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP COLUMN "milestonesId"`,
    );
    await queryRunner.query(`ALTER TABLE "milestones" ADD "mortgageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "UQ_4ea753e7e75553ca68ca7e85a0f" UNIQUE ("mortgageId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_4ea753e7e75553ca68ca7e85a0f" FOREIGN KEY ("mortgageId") REFERENCES "mortgage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
