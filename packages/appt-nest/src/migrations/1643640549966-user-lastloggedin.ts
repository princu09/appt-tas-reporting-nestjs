import { MigrationInterface, QueryRunner } from 'typeorm';

export class userLastloggedin1643640549966 implements MigrationInterface {
  name = 'userLastloggedin1643640549966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastLoggedIn" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastLoggedIn"`);
  }
}
