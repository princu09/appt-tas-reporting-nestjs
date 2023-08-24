import { MigrationInterface, QueryRunner } from 'typeorm';

export class contractorIdNotNull1673019485222 implements MigrationInterface {
  name = 'contractorIdNotNull1673019485222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ALTER COLUMN "contractorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ALTER COLUMN "contractorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
