import { MigrationInterface, QueryRunner } from 'typeorm';

export class SafetyObservationSubcategory1682515206818
  implements MigrationInterface
{
  name = 'SafetyObservationSubcategory1682515206818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."safety-observations_subcategory_enum" RENAME TO "safety-observations_subcategory_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_subcategory_enum" AS ENUM('Height Works', 'Excavations', 'Hot works', 'Confined Spaces', 'Lifting Operations', 'Maintenance', 'Cleaning', 'Electrical works (non-powered circuits)', 'Electrical (powered circuits)', 'Steel Erection', 'Concrete Works', 'Hand Tools', 'Machinery', 'Energy Isolation / Lock-Out & Tag-Out', 'Housekeeping', 'Uneven surfaces', 'Material Handling / Manual Handling', 'Vehicles', 'Chemical Handling / Use / Leaks', 'Hazardous Area / ATEX', 'Lighting', 'Air Quality', 'Bullying', 'Harrassment', 'Noise', 'Vibration', 'Resources and planning', 'Fatigue', 'Lone Working', 'Drugs and Alcohol Abuse', 'Agricultural works', 'Medical Operations', 'Radiation', 'Temperature Extremes', 'Pressure', 'Crushing', 'entanglement', 'entrapment', 'asphyxiation', 'Engulfment', 'Laceration')`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ALTER COLUMN "subcategory" TYPE "public"."safety-observations_subcategory_enum" USING "subcategory"::"text"::"public"."safety-observations_subcategory_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_subcategory_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_subcategory_enum_old" AS ENUM('sub1', 'sub2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ALTER COLUMN "subcategory" TYPE "public"."safety-observations_subcategory_enum_old" USING "subcategory"::"text"::"public"."safety-observations_subcategory_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_subcategory_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."safety-observations_subcategory_enum_old" RENAME TO "safety-observations_subcategory_enum"`,
    );
  }
}
