import { MigrationInterface, QueryRunner } from 'typeorm';

export class leaderBoardScore1643113793098 implements MigrationInterface {
  name = 'leaderBoardScore1643113793098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leaderboard" ADD "score" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leaderboard" DROP COLUMN "score"`);
  }
}
