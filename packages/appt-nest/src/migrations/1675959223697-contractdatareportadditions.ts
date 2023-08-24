import { MigrationInterface, QueryRunner } from 'typeorm';

export class contractdatareportadditions1675959223697
  implements MigrationInterface
{
  name = 'contractdatareportadditions1675959223697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numRIDDORSpecifiedInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numRIDDORDangerousOccurrences" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numFirstAidInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numJobTransferCases" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numJobTransferDays" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numDeaths" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLossConciounessCases" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numProcessSafetyTier3Events" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekRain" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekStorm" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekHighWinds" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekHeatColdStressManagement" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekCOVID19" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPowerCutsAndInterruptions" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekUnionStoppages" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPermitToWorkAuthorizations" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPlantStoppages" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPlantStoppages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekUnionStoppages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekCOVID19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekHeatColdStressManagement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekHighWinds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekStorm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekRain"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numProcessSafetyTier3Events"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLossConciounessCases"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numDeaths"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numJobTransferDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numJobTransferCases"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numFirstAidInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numRIDDORDangerousOccurrences"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numRIDDORSpecifiedInjuries"`,
    );
  }
}
