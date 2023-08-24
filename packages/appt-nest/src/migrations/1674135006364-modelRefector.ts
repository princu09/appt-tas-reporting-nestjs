import { MigrationInterface, QueryRunner } from 'typeorm';

export class modelRefector1674135006364 implements MigrationInterface {
  name = 'modelRefector1674135006364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_category_enum" AS ENUM('Physical Risk', 'Biological Risk', 'Chemical Risk', 'Physiological Risk')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_risklevel_enum" AS ENUM('High', 'Medium', 'Low', 'Good Practice')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_subcategory_enum" AS ENUM('sub1', 'sub2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_breachtype_enum" AS ENUM('Regulatory', 'Project Plan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_unsafeactorcondition_enum" AS ENUM('Unsafe Act', 'condition')`,
    );
    await queryRunner.query(
      `CREATE TABLE "safety-observations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "dateObserved" TIMESTAMP, "observation" text, "category" "public"."safety-observations_category_enum", "riskLevel" "public"."safety-observations_risklevel_enum", "subcategory" "public"."safety-observations_subcategory_enum", "breachType" "public"."safety-observations_breachtype_enum", "actionTaken" text, "requiredAction" text, "unsafeActOrCondition" "public"."safety-observations_unsafeactorcondition_enum", "contractorId" uuid, "signature" boolean, "closingSignature" boolean, CONSTRAINT "PK_d529bc91837eb8db7bcf8f44541" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contractor-data-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "weeklyWorkedHours" integer, "numOfWorkers" integer, "numLostTimeInjuries" integer, "numMajorInjuries" integer, "numDangerousOccurences" integer, "numNearMisses" integer, "medicalTreatmentInjuries" integer, "numRestrictedWorkCase" integer, "numLostDays" integer, "numRIDDOROccupationalIllnesses" integer, "numRIDDOR7DayInjuries" integer, "numRIDDOR3DayInjuries" integer, "numEmployeeOver7DayInjuries" integer, "numEmployeeOver3DayInjuries" integer, "numOSHARecordableInjuriesIllnesses" integer, "numTier1PSECount" integer, "numTier2PSECount" integer, "contractorId" uuid, "signature" boolean, CONSTRAINT "PK_7b70de74d3a310fc055c7d51b0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "incident-flash-report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "observed" TIMESTAMP, "areaId" uuid, "description" text, "contractorId" uuid, "signature" boolean, CONSTRAINT "PK_492f63bb754a9f6efb0d58a13bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ADD CONSTRAINT "FK_9c872cd104c21e3cca6435054bd" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ADD CONSTRAINT "FK_874394ead2c7bd170d9944774fa" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ADD CONSTRAINT "FK_0a69f0e286fe2720c07d729ed43" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ADD CONSTRAINT "FK_e84b3dcf88723064824ba26f36a" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD CONSTRAINT "FK_ceddb6e276acd248a44de77a4fe" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD CONSTRAINT "FK_74e1e600bd2606693bb903cf70a" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD CONSTRAINT "FK_39461c8232e4660c155824a8dff" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" ADD CONSTRAINT "FK_e9d6e2e982193d7a8bcb32b99b3" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" ADD CONSTRAINT "FK_b28689fe6843c659093d0ec1514" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" ADD CONSTRAINT "FK_8f3920ed84343edb530049f9c47" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" ADD CONSTRAINT "FK_f8e66fd7413fe4bd7ece8931275" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" ADD CONSTRAINT "FK_86978ab366404f69a9e07d0992a" FOREIGN KEY ("areaId") REFERENCES "area"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" ADD CONSTRAINT "FK_a2d246b5738bea974c950cfebc0" FOREIGN KEY ("contractorId") REFERENCES "organisationcontractor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`DROP TABLE safetyobservations`);
    await queryRunner.query(`DROP TABLE contractordatareport`);
    await queryRunner.query(`DROP TABLE incidentflashreport`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" DROP CONSTRAINT "FK_a2d246b5738bea974c950cfebc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" DROP CONSTRAINT "FK_86978ab366404f69a9e07d0992a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" DROP CONSTRAINT "FK_f8e66fd7413fe4bd7ece8931275"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" DROP CONSTRAINT "FK_8f3920ed84343edb530049f9c47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incident-flash-report" DROP CONSTRAINT "FK_b28689fe6843c659093d0ec1514"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP CONSTRAINT "FK_e9d6e2e982193d7a8bcb32b99b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP CONSTRAINT "FK_39461c8232e4660c155824a8dff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP CONSTRAINT "FK_74e1e600bd2606693bb903cf70a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contractor-data-report" DROP CONSTRAINT "FK_ceddb6e276acd248a44de77a4fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" DROP CONSTRAINT "FK_e84b3dcf88723064824ba26f36a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" DROP CONSTRAINT "FK_0a69f0e286fe2720c07d729ed43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" DROP CONSTRAINT "FK_874394ead2c7bd170d9944774fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" DROP CONSTRAINT "FK_9c872cd104c21e3cca6435054bd"`,
    );
    await queryRunner.query(`DROP TABLE "incident-flash-report"`);
    await queryRunner.query(`DROP TABLE "contractor-data-report"`);
    await queryRunner.query(`DROP TABLE "safety-observations"`);
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_unsafeactorcondition_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_breachtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_subcategory_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_risklevel_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_category_enum"`,
    );
  }
}
