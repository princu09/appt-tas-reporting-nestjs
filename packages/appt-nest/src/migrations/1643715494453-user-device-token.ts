import { MigrationInterface, QueryRunner } from 'typeorm';

export class userDeviceToken1643715494453 implements MigrationInterface {
  name = 'userDeviceToken1643715494453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device_token" DROP CONSTRAINT "unique_index_1"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device_token" ADD CONSTRAINT "unique_index_1" UNIQUE ("owner", "organisation", "site")`,
    );
  }
}
