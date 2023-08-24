import { MigrationInterface, QueryRunner } from 'typeorm';

export class userActivated1637926780438 implements MigrationInterface {
  name = 'userActivated1637926780438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "actived" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "actived"`);
  }
}
