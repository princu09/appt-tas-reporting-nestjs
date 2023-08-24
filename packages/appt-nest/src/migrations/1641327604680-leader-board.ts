import { MigrationInterface, QueryRunner } from 'typeorm';

export class leaderBoard1641327604680 implements MigrationInterface {
  name = 'leaderBoard1641327604680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "leaderboard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_76fd1d52cf44d209920f73f4608" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "leaderboard"`);
  }
}
