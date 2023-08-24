import { MigrationInterface, QueryRunner } from 'typeorm';

export class roleUpdate1637598399018 implements MigrationInterface {
  name = 'roleUpdate1637598399018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissions"`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "permissions" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isdeveloper" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "enabledbcache" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isglobaladmin" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ALTER COLUMN "processed" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "public" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "contentIsPublic" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "sharedAppOwner" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hasCustomApp" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hassites" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hassites" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "hasCustomApp" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "sharedAppOwner" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "contentIsPublic" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "public" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ALTER COLUMN "processed" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isglobaladmin" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "enabledbcache" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isdeveloper" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissions"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "permissions" text`);
  }
}
