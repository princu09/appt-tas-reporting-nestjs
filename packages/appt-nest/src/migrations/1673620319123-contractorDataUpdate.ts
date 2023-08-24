import { MigrationInterface, QueryRunner } from 'typeorm';

export class contractorDataUpdate1673620319123 implements MigrationInterface {
  name = 'contractorDataUpdate1673620319123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numRIDDOROccupationalIllnesses" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numRIDDOR7DayInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numRIDDOR3DayInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numEmployeeOver7DayInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numEmployeeOver3DayInjuries" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numOSHARecordableInjuriesIllnesses" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numTier1PSECount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD "numTier2PSECount" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numTier2PSECount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numTier1PSECount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numOSHARecordableInjuriesIllnesses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numEmployeeOver3DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numEmployeeOver7DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numRIDDOR3DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numRIDDOR7DayInjuries"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP COLUMN "numRIDDOROccupationalIllnesses"`,
    );
  }
}
