import { MigrationInterface, QueryRunner } from 'typeorm';

export class paymentModelsAdditions1649067512949 implements MigrationInterface {
  name = 'paymentModelsAdditions1649067512949';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "apptledger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cost" numeric(10,2) NOT NULL, "outstanding" boolean NOT NULL DEFAULT true, "stripeTransferID" text, "stripeIntentID" text, "rolledover" boolean NOT NULL DEFAULT false, "receivedAt" TIMESTAMP, "organisation" uuid NOT NULL, CONSTRAINT "PK_584cd8e5a797ac12ff98553555a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationcharge" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "cost" numeric(10,2) NOT NULL, "description" text, "processed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d8c8e2669814a3fa1a7ea8e606d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationcontract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "cost" numeric(10,2) NOT NULL, CONSTRAINT "PK_12d6caee4b20efcc1551b54f751" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationuserpurchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "productId" uuid NOT NULL, "cost" numeric(10,2) NOT NULL, "processed" boolean NOT NULL DEFAULT false, "received" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4cc9d3f4694ddea5db24f5948bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "OrganisationProduct" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "description" text, "cost" numeric(10,2) NOT NULL, "active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2367522be813fafd1275a01f9fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "stripeConnectAccountId" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "apptledger" ADD CONSTRAINT "FK_90274952115463b47c7e6f27ba6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" ADD CONSTRAINT "FK_e9fc87abfa3b395a2ecef59a41b" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" ADD CONSTRAINT "FK_c876a9b1ea3eaac46b21aee3639" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" ADD CONSTRAINT "FK_0881219f1a9013e5e8eb1965e89" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" ADD CONSTRAINT "FK_f9cac5fada21856af745e61252c" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" ADD CONSTRAINT "FK_d21416cc066d8962eee198711ff" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" ADD CONSTRAINT "FK_ad0c7af1893106d2d99f3fc9e74" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" ADD CONSTRAINT "FK_9eb183091df1767cd88210c9fad" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" ADD CONSTRAINT "FK_cd0590efd4e23818d17d1b974f6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" ADD CONSTRAINT "FK_d1c0d484ebe3fb700b34857e224" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" ADD CONSTRAINT "FK_1755b1a9b750c809a48a1cb48ee" FOREIGN KEY ("productId") REFERENCES "OrganisationProduct"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" ADD CONSTRAINT "FK_a9cd9e14fa76483b96a9b2b5854" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" ADD CONSTRAINT "FK_04015b23f04c78b884568b69f74" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" ADD CONSTRAINT "FK_12723217c6662ca15c31a5b3096" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" DROP CONSTRAINT "FK_12723217c6662ca15c31a5b3096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" DROP CONSTRAINT "FK_04015b23f04c78b884568b69f74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "OrganisationProduct" DROP CONSTRAINT "FK_a9cd9e14fa76483b96a9b2b5854"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" DROP CONSTRAINT "FK_1755b1a9b750c809a48a1cb48ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" DROP CONSTRAINT "FK_d1c0d484ebe3fb700b34857e224"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" DROP CONSTRAINT "FK_cd0590efd4e23818d17d1b974f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationuserpurchases" DROP CONSTRAINT "FK_9eb183091df1767cd88210c9fad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" DROP CONSTRAINT "FK_ad0c7af1893106d2d99f3fc9e74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" DROP CONSTRAINT "FK_d21416cc066d8962eee198711ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcontract" DROP CONSTRAINT "FK_f9cac5fada21856af745e61252c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" DROP CONSTRAINT "FK_0881219f1a9013e5e8eb1965e89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" DROP CONSTRAINT "FK_c876a9b1ea3eaac46b21aee3639"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationcharge" DROP CONSTRAINT "FK_e9fc87abfa3b395a2ecef59a41b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apptledger" DROP CONSTRAINT "FK_90274952115463b47c7e6f27ba6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "stripeConnectAccountId"`,
    );
    await queryRunner.query(`DROP TABLE "OrganisationProduct"`);
    await queryRunner.query(`DROP TABLE "organisationuserpurchases"`);
    await queryRunner.query(`DROP TABLE "organisationcontract"`);
    await queryRunner.query(`DROP TABLE "organisationcharge"`);
    await queryRunner.query(`DROP TABLE "apptledger"`);
  }
}
