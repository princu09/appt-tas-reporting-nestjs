import { MigrationInterface, QueryRunner } from 'typeorm';

export class nullableBase1645535250303 implements MigrationInterface {
  name = 'nullableBase1645535250303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ALTER COLUMN "owner" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ALTER COLUMN "organisation" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_2a396bddb7d6684b706b1da74f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_ebdd338156c840c53e40e84a93c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ALTER COLUMN "owner" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ALTER COLUMN "organisation" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_b99e4b84eb02750809d69d99403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ALTER COLUMN "owner" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ALTER COLUMN "organisation" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_2a396bddb7d6684b706b1da74f1" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_ebdd338156c840c53e40e84a93c" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_b99e4b84eb02750809d69d99403" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" DROP CONSTRAINT "FK_b99e4b84eb02750809d69d99403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_ebdd338156c840c53e40e84a93c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_2a396bddb7d6684b706b1da74f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ALTER COLUMN "organisation" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ALTER COLUMN "owner" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_d84874b2cdf921d5ed4a1619ae7" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questionaire" ADD CONSTRAINT "FK_b99e4b84eb02750809d69d99403" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ALTER COLUMN "organisation" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ALTER COLUMN "owner" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_ebdd338156c840c53e40e84a93c" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_2a396bddb7d6684b706b1da74f1" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ALTER COLUMN "organisation" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ALTER COLUMN "owner" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
