import { MigrationInterface, QueryRunner } from 'typeorm';

export class listing1644486696777 implements MigrationInterface {
  name = 'listing1644486696777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "addressLine1" character varying, "addressLine2" character varying, "postCode" character varying, "city" character varying, "cost_pppw" money, "bedroomCount" integer, "briefDescription" character varying, "fullDescription" character varying, "agentContactNumber" character varying, "holdingFee" money, "isLive" boolean NOT NULL DEFAULT false, "billsIncluded" boolean NOT NULL DEFAULT false, "reserved" boolean NOT NULL DEFAULT false, "contractLength" integer, "availableFrom" TIMESTAMP, "keyFeatures" character varying, "name" character varying, "locationSummary" character varying, "latitude" integer, "longitude" integer, "floorplanURL" character varying, "videoURL" character varying, "epcURL" character varying, "listingMediaId" uuid, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_e4602714cb904aced029b5bdd73" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_192c03e8e2fd0edf51db6e41be7" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_04b2821ce513622c6cb67bed448" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" ADD CONSTRAINT "FK_0a1bcdce36507666178732bf10c" FOREIGN KEY ("listingMediaId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_0a1bcdce36507666178732bf10c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_04b2821ce513622c6cb67bed448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_192c03e8e2fd0edf51db6e41be7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "listing" DROP CONSTRAINT "FK_e4602714cb904aced029b5bdd73"`,
    );
    await queryRunner.query(`DROP TABLE "listing"`);
  }
}
