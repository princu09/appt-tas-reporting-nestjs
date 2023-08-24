import { MigrationInterface, QueryRunner } from 'typeorm';

export class allowNulls1673887756479 implements MigrationInterface {
  name = 'allowNulls1673887756479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ALTER COLUMN "contractorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_1395883739fa63d601e85c0aeca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" DROP CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ALTER COLUMN "areaId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ALTER COLUMN "contractorId" DROP NOT NULL`,
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
      `ALTER TABLE "incidentflashreport" ALTER COLUMN "contractorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ALTER COLUMN "areaId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_a437f0e3f7a0c29f4ffb19c38ae" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidentflashreport" ADD CONSTRAINT "FK_1395883739fa63d601e85c0aeca" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ALTER COLUMN "contractorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_ebad2da2f7d669d7f2a5d47377b" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
