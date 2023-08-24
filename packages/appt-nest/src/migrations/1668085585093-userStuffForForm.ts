import { MigrationInterface, QueryRunner } from 'typeorm';

export class userStuffForForm1668085585093 implements MigrationInterface {
  name = 'userStuffForForm1668085585093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD "owner" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD "organisation" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "test-form" ADD "site" uuid`);
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD CONSTRAINT "FK_9b45a95d93fafbe74ff23c78189" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD CONSTRAINT "FK_58818e3fe0f64f65b0b0bafbaf0" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD CONSTRAINT "FK_44ff20e6ca339457a26a33737dc" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test-form" DROP CONSTRAINT "FK_44ff20e6ca339457a26a33737dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" DROP CONSTRAINT "FK_58818e3fe0f64f65b0b0bafbaf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" DROP CONSTRAINT "FK_9b45a95d93fafbe74ff23c78189"`,
    );
    await queryRunner.query(`ALTER TABLE "test-form" DROP COLUMN "site"`);
    await queryRunner.query(
      `ALTER TABLE "test-form" DROP COLUMN "organisation"`,
    );
    await queryRunner.query(`ALTER TABLE "test-form" DROP COLUMN "owner"`);
    await queryRunner.query(`ALTER TABLE "test-form" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "test-form" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "test-form" DROP COLUMN "deletedAt"`);
  }
}
