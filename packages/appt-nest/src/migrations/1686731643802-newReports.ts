import { MigrationInterface, QueryRunner } from 'typeorm';

export class newReports1686731643802 implements MigrationInterface {
  name = 'newReports1686731643802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lost-time-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "numLostHoursPerWeekRain" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekStorm" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekHighWinds" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekHeatColdStressManagement" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekCOVID19" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekPowerCutsAndInterruptions" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekUnionStoppages" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekPermitToWorkAuthorizations" integer NOT NULL DEFAULT '0', "numLostHoursPerWeekPlantStoppages" integer NOT NULL DEFAULT '0', "contractorId" uuid, "signature" boolean, CONSTRAINT "PK_d0a15c91c89ccf11519cd94d364" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numMajorInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numRIDDOR3DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numEmployeeOver7DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numEmployeeOver3DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOSHARecordableInjuriesIllnesses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numJobTransferCases"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numJobTransferDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numProcessSafetyTier3Events"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekRain"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekStorm"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekHighWinds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekHeatColdStressManagement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekCOVID19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPowerCutsAndInterruptions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekUnionStoppages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPermitToWorkAuthorizations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numLostHoursPerWeekPlantStoppages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numRIDDORMajorInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOSHAJobTransferCases" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOSHAJobTransferDays" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOSHARecordableInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numTier3PSECount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOfWorkers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOfWorkers" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" ADD CONSTRAINT "FK_8d8c864ceac486e9db66cfba98d" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" ADD CONSTRAINT "FK_60955a36bee2d1ea2069d4efafb" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" ADD CONSTRAINT "FK_9d9e130f55ad21daa63c862642b" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" ADD CONSTRAINT "FK_114ec6baf8a7f39c183f52294fe" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" DROP CONSTRAINT "FK_114ec6baf8a7f39c183f52294fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" DROP CONSTRAINT "FK_9d9e130f55ad21daa63c862642b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" DROP CONSTRAINT "FK_60955a36bee2d1ea2069d4efafb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lost-time-report" DROP CONSTRAINT "FK_8d8c864ceac486e9db66cfba98d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOfWorkers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOfWorkers" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numTier3PSECount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOSHARecordableInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOSHAJobTransferDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numOSHAJobTransferCases"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP COLUMN "numRIDDORMajorInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPlantStoppages" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPermitToWorkAuthorizations" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekUnionStoppages" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekPowerCutsAndInterruptions" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekCOVID19" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekHeatColdStressManagement" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekHighWinds" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekStorm" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numLostHoursPerWeekRain" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numProcessSafetyTier3Events" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numJobTransferDays" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numJobTransferCases" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numOSHARecordableInjuriesIllnesses" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numEmployeeOver3DayInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numEmployeeOver7DayInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numRIDDOR3DayInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD "numMajorInjuries" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "lost-time-report"`);
  }
}
