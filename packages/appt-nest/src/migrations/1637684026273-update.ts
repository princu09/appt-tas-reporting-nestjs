import { MigrationInterface, QueryRunner } from 'typeorm';

export class update1637684026273 implements MigrationInterface {
  name = 'update1637684026273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" DROP COLUMN "date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "enabledbcache" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isglobaladmin" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ALTER COLUMN "processed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP COLUMN "submission"`,
    );
    await queryRunner.query(`ALTER TABLE "formresponse" ADD "submission" uuid`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "subscription"`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "subscription" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "public" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "contentIsPublic" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "sharedAppOwner" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hasCustomApp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hassites" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_87c214454b47e63ceead212737e" FOREIGN KEY ("submission") REFERENCES "formsubmission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_f3e89e4f320e1913a5df44e73d8" FOREIGN KEY ("subscription") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_f3e89e4f320e1913a5df44e73d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_87c214454b47e63ceead212737e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hassites" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hasCustomApp" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "sharedAppOwner" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "contentIsPublic" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "public" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "subscription"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "subscription" integer`);
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP COLUMN "submission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD "submission" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ALTER COLUMN "processed" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isglobaladmin" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "enabledbcache" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" ADD "date" TIMESTAMP`,
    );
  }
}
