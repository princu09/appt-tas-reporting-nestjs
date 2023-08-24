import { MigrationInterface, QueryRunner } from 'typeorm';

export class testform1668079896277 implements MigrationInterface {
  name = 'testform1668079896277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."test-form_italianfoodpreference_enum" AS ENUM('ILOVEPIZZA', 'IHATEPIZZA', 'IPREFERLASAGNA')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."test-form_pizaatopping_enum" AS ENUM('pepperoni', 'pineapple', 'cheese')`,
    );
    await queryRunner.query(
      `CREATE TABLE "test-form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "DOB" date NOT NULL, "ItalianFoodPreference" "public"."test-form_italianfoodpreference_enum" NOT NULL, "pizaaTopping" "public"."test-form_pizaatopping_enum" NOT NULL, "signed" boolean NOT NULL, "doYouLikeCheese" boolean NOT NULL, "age" integer NOT NULL, "aboutYourself" text NOT NULL, "iDPictureId" uuid, CONSTRAINT "REL_bc0fe861f923ed1ab813a00a8c" UNIQUE ("iDPictureId"), CONSTRAINT "PK_4014e5863d004f00b644656f1fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "test-form" ADD CONSTRAINT "FK_bc0fe861f923ed1ab813a00a8c1" FOREIGN KEY ("iDPictureId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "test-form" DROP CONSTRAINT "FK_bc0fe861f923ed1ab813a00a8c1"`,
    );
    await queryRunner.query(`DROP TABLE "test-form"`);
    await queryRunner.query(`DROP TYPE "public"."test-form_pizaatopping_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."test-form_italianfoodpreference_enum"`,
    );
  }
}
