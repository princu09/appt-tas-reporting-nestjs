import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractDataReport1668680901904 implements MigrationInterface {
  name = 'ContractDataReport1668680901904';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contractordatareport" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "weeklyWorkedHours" integer, "numOfWorkers" integer, "numLostTimeInjuries" integer, "numMajorInjuries" integer, "numDangerousOccurences" integer, "numNearMisses" integer, "medicalTreatmentInjuries" integer, "numRestrictedWorkCase" integer, "numLostDays" integer, "signature" boolean, CONSTRAINT "PK_feda34fa6347828aca06aea110d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_662bf39baada8414fff5b358b26" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_a83c5d40c7ca5f422166a51a796" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" ADD CONSTRAINT "FK_9de3b6167e9f4369472df335208" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_9de3b6167e9f4369472df335208"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_a83c5d40c7ca5f422166a51a796"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractordatareport" DROP CONSTRAINT "FK_662bf39baada8414fff5b358b26"`,
    );
    await queryRunner.query(`DROP TABLE "contractordatareport"`);
  }
}
