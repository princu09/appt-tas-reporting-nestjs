import { MigrationInterface, QueryRunner } from 'typeorm';

export class reportOneToOne1673625909483 implements MigrationInterface {
  name = 'reportOneToOne1673625909483';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "UQ_66e282c3d722a19db0b7f9f9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "UQ_ebad2da2f7d669d7f2a5d47377b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_1395883739fa63d601e85c0aeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "REL_1395883739fa63d601e85c0aec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "UQ_a437f0e3f7a0c29f4ffb19c38ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_1395883739fa63d601e85c0aeca" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_1395883739fa63d601e85c0aeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "UQ_a437f0e3f7a0c29f4ffb19c38ae" UNIQUE ("contractorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "REL_1395883739fa63d601e85c0aec" UNIQUE ("areaId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_1395883739fa63d601e85c0aeca" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "UQ_ebad2da2f7d669d7f2a5d47377b" UNIQUE ("contractorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "UQ_66e282c3d722a19db0b7f9f9129" UNIQUE ("contractorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_66e282c3d722a19db0b7f9f9129" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
