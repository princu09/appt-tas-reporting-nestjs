import { MigrationInterface, QueryRunner } from 'typeorm';

export class safetyObservationsForm1668617832069 implements MigrationInterface {
  name = 'safetyObservationsForm1668617832069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."safetyobservations_category_enum" AS ENUM('Physical Risk', 'Biological Risk', 'Chemical Risk', 'Physiological Risk')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safetyobservations_risklevel_enum" AS ENUM('High', 'Medium', 'Low', 'Good Practice')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safetyobservations_subcategory_enum" AS ENUM('sub1', 'sub2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safetyobservations_breachtype_enum" AS ENUM('Regulatory', 'Project Plan')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safetyobservations_unsafeactorcondition_enum" AS ENUM('Unsafe Act', 'condition')`,
    );
    await queryRunner.query(
      `CREATE TABLE "safetyobservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "dateObserved" TIMESTAMP, "observation" text, "category" "public"."safetyobservations_category_enum", "riskLevel" "public"."safetyobservations_risklevel_enum", "subcategory" "public"."safetyobservations_subcategory_enum", "breachType" "public"."safetyobservations_breachtype_enum", "actionTaken" text, "requiredAction" text, "unsafeActOrCondition" "public"."safetyobservations_unsafeactorcondition_enum", "signature" boolean, "closingSignature" boolean, CONSTRAINT "PK_a6a2b9fef0ea9c9df235f47e9b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_4e676559664c2ee8d7ec332952d" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_4259e10d63f42d755b4f5b28a3a" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" ADD CONSTRAINT "FK_f3aca6dcd2c96b97d34d8223eeb" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_f3aca6dcd2c96b97d34d8223eeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_4259e10d63f42d755b4f5b28a3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "safetyobservations" DROP CONSTRAINT "FK_4e676559664c2ee8d7ec332952d"`,
    );
    await queryRunner.query(`DROP TABLE "safetyobservations"`);
    await queryRunner.query(
      `DROP TYPE "public"."safetyobservations_unsafeactorcondition_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safetyobservations_breachtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safetyobservations_subcategory_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safetyobservations_risklevel_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safetyobservations_category_enum"`,
    );
  }
}
