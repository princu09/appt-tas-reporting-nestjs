import { MigrationInterface, QueryRunner } from 'typeorm';

export class newEnum1683812614492 implements MigrationInterface {
  name = 'newEnum1683812614492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."safety-observations_unsafeactorcondition_enum" RENAME TO "safety-observations_unsafeactorcondition_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_unsafeactorcondition_enum" AS ENUM('Act', 'Condition')`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ALTER COLUMN "unsafeActOrCondition" TYPE "public"."safety-observations_unsafeactorcondition_enum" USING "unsafeActOrCondition"::"text"::"public"."safety-observations_unsafeactorcondition_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_unsafeactorcondition_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_unsafeactorcondition_enum_old" AS ENUM('Unsafe Act', 'condition')`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ALTER COLUMN "unsafeActOrCondition" TYPE "public"."safety-observations_unsafeactorcondition_enum_old" USING "unsafeActOrCondition"::"text"::"public"."safety-observations_unsafeactorcondition_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_unsafeactorcondition_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."safety-observations_unsafeactorcondition_enum_old" RENAME TO "safety-observations_unsafeactorcondition_enum"`,
    );
  }
}
