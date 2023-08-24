import { MigrationInterface, QueryRunner } from 'typeorm';

export class knightsQuestionnaire1643623842649 implements MigrationInterface {
  name = 'knightsQuestionnaire1643623842649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_261fa3d243508bfc94e45405e23"`,
    );
    await queryRunner.query(
      `CREATE TABLE "questionaire" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "MatterAdminDetails" jsonb NOT NULL, "BorrowerDetails" jsonb NOT NULL, "PropertyDetails" jsonb NOT NULL, "BrokerDetails" jsonb NOT NULL, "KeyDatesDetails" jsonb NOT NULL, "LeaseholdDetails" jsonb NOT NULL, "SurplusShortfallDetails" jsonb NOT NULL, "AdditionalLandDetails" jsonb NOT NULL, "LenderDetails" jsonb NOT NULL, "MortgageDetails" jsonb NOT NULL, "BuildingsInsuranceDetails" jsonb NOT NULL, "OccupierDetails" jsonb NOT NULL, "AdditionalInfoDetails" jsonb NOT NULL, CONSTRAINT "PK_4ddc64410a1958b3d37c51babd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_b99e4b84eb02750809d69d99403" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_7f8ed9e2fe858785bc9da56e917" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_261fa3d243508bfc94e45405e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_261fa3d243508bfc94e45405e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_7f8ed9e2fe858785bc9da56e917"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_b99e4b84eb02750809d69d99403"`,
    );
    await queryRunner.query(`DROP TABLE "questionaire"`);
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_261fa3d243508bfc94e45405e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
