import { MigrationInterface, QueryRunner } from 'typeorm';

export class knightsMortgageMilestone1641563660939
  implements MigrationInterface
{
  name = 'knightsMortgageMilestone1641563660939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mortgage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "Solitor" jsonb NOT NULL, "Admin" jsonb NOT NULL, "PropertyDetails" jsonb NOT NULL, "BorrowerDetails" jsonb NOT NULL, "Reference" text NOT NULL, CONSTRAINT "UQ_d8acff9d76c83ffa7597339f96d" UNIQUE ("Reference"), CONSTRAINT "PK_083a27028d698c1cc2f611f7944" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "milestones" ADD "mortgageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "UQ_4ea753e7e75553ca68ca7e85a0f" UNIQUE ("mortgageId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetToken" uuid`);
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" ADD CONSTRAINT "FK_c0274c9c3be13d6d1a196dfbab3" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" ADD CONSTRAINT "FK_4ea753e7e75553ca68ca7e85a0f" FOREIGN KEY ("mortgageId") REFERENCES "mortgage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "FK_4ea753e7e75553ca68ca7e85a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_c0274c9c3be13d6d1a196dfbab3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_0e3bebf119d7c5c4e81d0071ded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mortgage" DROP CONSTRAINT "FK_4cdc7d5e96da8d1e0887072f865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP CONSTRAINT "UQ_4ea753e7e75553ca68ca7e85a0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones" DROP COLUMN "mortgageId"`,
    );
    await queryRunner.query(`DROP TABLE "mortgage"`);
  }
}
