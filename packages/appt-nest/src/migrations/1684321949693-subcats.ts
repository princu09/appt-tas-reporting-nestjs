import { MigrationInterface, QueryRunner } from 'typeorm';

export class subcats1684321949693 implements MigrationInterface {
  name = 'subcats1684321949693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."safety-observations_subcategory_enum" RENAME TO "safety-observations_subcategory_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_subcategory_enum" AS ENUM('Height Works', 'Excavations', 'Hot works', 'Confined Spaces', 'Lifting Operations', 'Maintenance', 'Cleaning', 'Electrical works (non-powered circuits)', 'Electrical (powered circuits)', 'Steel Erection', 'Concrete Works', 'Hand Tools', 'Power Tool', 'Machinery', 'Energy Isolation / Lock-Out & Tag-Out', 'Housekeeping', 'Uneven surfaces', 'Material Handling / Manual Handling', 'Vehicles', 'Chemical Handling / Use / Leaks', 'Hazardous Area / ATEX', 'Lighting', 'Air Quality', 'Bullying', 'Harassment', 'Noise', 'Vibration', 'Resource and planning', 'Fatigue', 'Lone Working', 'Drugs and Alcohol Abuse', 'Agricultural works', 'Medical Operations', 'Radiation', 'Temperature Extremes', 'Pressure', 'Crushing', 'entanglement', 'entrapment', 'asphyxiation', 'Engulfment', 'Laceration')`,
    );
    await queryRunner.query(
      `ALTER TABLE "safety-observations" ALTER COLUMN "subcategory" TYPE "public"."safety-observations_subcategory_enum" USING "subcategory"::"text"::"public"."safety-observations_subcategory_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."safety-observations_subcategory_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMin" SET DEFAULT '0.41'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMax" SET DEFAULT '2.7'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMin" SET DEFAULT '1.8'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMax" SET DEFAULT '3.5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "DARTMax" SET DEFAULT '1.5'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "DARTMax" SET DEFAULT 1.5`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMax" SET DEFAULT 3.5`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "TRIRMin" SET DEFAULT 1.8`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMax" SET DEFAULT 2.7`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ALTER COLUMN "LTIRMin" SET DEFAULT 0.41`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."safety-observations_subcategory_enum_old" AS ENUM('Height Works', 'Excavations', 'Hot works', 'Confined Spaces', 'Lifting Operations', 'Maintenance', 'Cleaning', 'Electrical works (non-powered circuits)', 'Electrical (powered circuits)', 'Steel Erection', 'Concrete Works', 'Hand Tools', 'Machinery', 'Energy Isolation / Lock-Out & Tag-Out', 'Housekeeping', 'Uneven surfaces', 'Material Handling / Manual Handling', 'Vehicles', 'Chemical Handling / Use / Leaks', 'Hazardous Area / ATEX', 'Lighting', 'Air Quality', 'Bullying', 'Harrassment', 'Noise', 'Vibration', 'Resources and planning', 'Fatigue', 'Lone Working', 'Drugs and Alcohol Abuse', 'Agricultural works', 'Medical Operations', 'Radiation', 'Temperature Extremes', 'Pressure', 'Crushing', 'entanglement', 'entrapment', 'asphyxiation', 'Engulfment', 'Laceration')`,
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
