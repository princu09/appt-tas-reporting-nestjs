import { MigrationInterface, QueryRunner } from 'typeorm';

export class setContractDataReportDefaults1682592192565
  implements MigrationInterface
{
  name = 'setContractDataReportDefaults1682592192565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "weeklyWorkedHours" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfWorkers" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfWorkers" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostTimeInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostTimeInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfPropertyDamagedEvents" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfPropertyDamagedEvents" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numMajorInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numMajorInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDangerousOccurences" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDangerousOccurences" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numNearMisses" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numNearMisses" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "medicalTreatmentInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "medicalTreatmentInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRestrictedWorkCase" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRestrictedWorkCase" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostDays" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostDays" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOROccupationalIllnesses" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOROccupationalIllnesses" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR7DayInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR7DayInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR3DayInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR3DayInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver7DayInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver7DayInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver3DayInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver3DayInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOSHARecordableInjuriesIllnesses" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOSHARecordableInjuriesIllnesses" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier1PSECount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier1PSECount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier2PSECount" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier2PSECount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORSpecifiedInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORSpecifiedInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORDangerousOccurrences" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORDangerousOccurrences" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numFirstAidInjuries" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numFirstAidInjuries" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferCases" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferCases" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferDays" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferDays" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDeaths" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDeaths" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLossConciounessCases" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLossConciounessCases" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numProcessSafetyTier3Events" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numProcessSafetyTier3Events" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekRain" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekRain" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekStorm" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekStorm" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHighWinds" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHighWinds" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHeatColdStressManagement" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHeatColdStressManagement" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekCOVID19" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekCOVID19" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekUnionStoppages" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekUnionStoppages" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPlantStoppages" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPlantStoppages" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPlantStoppages" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPlantStoppages" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekUnionStoppages" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekUnionStoppages" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekCOVID19" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekCOVID19" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHeatColdStressManagement" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHeatColdStressManagement" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHighWinds" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekHighWinds" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekStorm" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekStorm" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekRain" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostHoursPerWeekRain" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numProcessSafetyTier3Events" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numProcessSafetyTier3Events" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLossConciounessCases" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLossConciounessCases" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDeaths" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDeaths" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferDays" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferDays" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferCases" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numJobTransferCases" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numFirstAidInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numFirstAidInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORDangerousOccurrences" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORDangerousOccurrences" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORSpecifiedInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDORSpecifiedInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier2PSECount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier2PSECount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier1PSECount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numTier1PSECount" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOSHARecordableInjuriesIllnesses" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOSHARecordableInjuriesIllnesses" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver3DayInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver3DayInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver7DayInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numEmployeeOver7DayInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR3DayInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR3DayInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR7DayInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOR7DayInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOROccupationalIllnesses" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRIDDOROccupationalIllnesses" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostDays" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostDays" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRestrictedWorkCase" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numRestrictedWorkCase" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "medicalTreatmentInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "medicalTreatmentInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numNearMisses" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numNearMisses" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDangerousOccurences" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numDangerousOccurences" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numMajorInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numMajorInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfPropertyDamagedEvents" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfPropertyDamagedEvents" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostTimeInjuries" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numLostTimeInjuries" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfWorkers" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "numOfWorkers" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ALTER COLUMN "weeklyWorkedHours" DROP DEFAULT`,
    );
  }
}
