import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixRecords1674209231373 implements MigrationInterface {
  name = 'fixRecords1674209231373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record" ADD "photoEvidenceSoId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD "photoEvidenceClosureSoId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "record" ADD "pictureIFRId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_1e76b3464ecf0e0f5bf6ec1a0ff" FOREIGN KEY ("photoEvidenceSoId") REFERENCES "safety-observations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_a0969e5479b4d30de253c35731d" FOREIGN KEY ("photoEvidenceClosureSoId") REFERENCES "safety-observations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_1db777893b74a339ba3ee98589a" FOREIGN KEY ("pictureIFRId") REFERENCES "incident-flash-report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_1db777893b74a339ba3ee98589a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_a0969e5479b4d30de253c35731d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_1e76b3464ecf0e0f5bf6ec1a0ff"`,
    );
    await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "pictureIFRId"`);
    await queryRunner.query(
      `ALTER TABLE "record" DROP COLUMN "photoEvidenceClosureSoId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP COLUMN "photoEvidenceSoId"`,
    );
  }
}
