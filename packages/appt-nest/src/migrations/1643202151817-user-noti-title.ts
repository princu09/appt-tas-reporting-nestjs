import { MigrationInterface, QueryRunner } from 'typeorm';

export class userNotiTitle1643202151817 implements MigrationInterface {
  name = 'userNotiTitle1643202151817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_261fa3d243508bfc94e45405e23"`,
    );
    await queryRunner.query(`ALTER TABLE "usernotification" ADD "title" text`);
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP COLUMN "message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD "message" text`,
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
      `ALTER TABLE "usernotification" DROP COLUMN "message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD "message" character varying(1024)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_261fa3d243508bfc94e45405e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
