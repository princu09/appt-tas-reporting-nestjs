import { MigrationInterface, QueryRunner } from 'typeorm';

export class userDeleteDefault1670582261316 implements MigrationInterface {
  name = 'userDeleteDefault1670582261316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "deleted" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "deleted" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "deleted" DROP NOT NULL`,
    );
  }
}
