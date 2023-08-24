import { MigrationInterface, QueryRunner } from 'typeorm';

export class calendarUnique1643714155001 implements MigrationInterface {
  name = 'calendarUnique1643714155001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "UQ_7956be7945a647e93a983774755" UNIQUE ("event", "attendee")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "UQ_7956be7945a647e93a983774755"`,
    );
  }
}
