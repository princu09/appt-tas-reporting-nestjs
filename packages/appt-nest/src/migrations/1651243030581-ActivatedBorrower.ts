import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivatedBorrower1651243030581 implements MigrationInterface {
  name = 'ActivatedBorrower1651243030581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activatedborrower" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "borrowerId" uuid, "mortgageId" uuid, CONSTRAINT "PK_2953adafff24dbf8815a93cb59e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "activatedborrower" ADD CONSTRAINT "FK_25358a1b0e917d0fa49c07f27db" FOREIGN KEY ("borrowerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activatedborrower" ADD CONSTRAINT "FK_c1beb4c5c786c2d4aa9b5be8db2" FOREIGN KEY ("mortgageId") REFERENCES "mortgage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activatedborrower" DROP CONSTRAINT "FK_c1beb4c5c786c2d4aa9b5be8db2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activatedborrower" DROP CONSTRAINT "FK_25358a1b0e917d0fa49c07f27db"`,
    );
    await queryRunner.query(`DROP TABLE "activatedborrower"`);
  }
}
