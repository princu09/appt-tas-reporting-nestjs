import { MigrationInterface, QueryRunner } from 'typeorm';

export class mortageUpdates1645617740394 implements MigrationInterface {
  name = 'mortageUpdates1645617740394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mortgage_borrowers_user" ("mortgageId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e09c55e1bf0d7ba63e5d459082c" PRIMARY KEY ("mortgageId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96e9bcf7f1aa20192c649df850" ON "mortgage_borrowers_user" ("mortgageId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58737eecfe822cd2199f93816a" ON "mortgage_borrowers_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage_borrowers_user" ADD CONSTRAINT "FK_96e9bcf7f1aa20192c649df8502" FOREIGN KEY ("mortgageId") REFERENCES "mortgage"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage_borrowers_user" ADD CONSTRAINT "FK_58737eecfe822cd2199f93816a6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mortgage_borrowers_user" DROP CONSTRAINT "FK_58737eecfe822cd2199f93816a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage_borrowers_user" DROP CONSTRAINT "FK_96e9bcf7f1aa20192c649df8502"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58737eecfe822cd2199f93816a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96e9bcf7f1aa20192c649df850"`,
    );
    await queryRunner.query(`DROP TABLE "mortgage_borrowers_user"`);
  }
}
