import { MigrationInterface, QueryRunner } from 'typeorm';

export class testFormNullable1668092236143 implements MigrationInterface {
  name = 'testFormNullable1668092236143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "firstName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "lastName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "DOB" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "ItalianFoodPreference" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "pizaaTopping" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "signed" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "doYouLikeCheese" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "age" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "aboutYourself" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "aboutYourself" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "age" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "doYouLikeCheese" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "signed" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "pizaaTopping" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "ItalianFoodPreference" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "DOB" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "lastName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ALTER COLUMN "firstName" SET NOT NULL`,
    );
  }
}
