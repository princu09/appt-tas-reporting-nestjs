import { MigrationInterface, QueryRunner } from 'typeorm';

export class uploadChunk1644514832743 implements MigrationInterface {
  name = 'uploadChunk1644514832743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chunkupload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "uploadId" character varying NOT NULL, "fileName" character varying NOT NULL, "key" character varying NOT NULL, "fileType" character varying NOT NULL, "bucket" character varying NOT NULL, "partsUploaded" jsonb DEFAULT '[]', "finishedRecordId" uuid, CONSTRAINT "PK_8d45810b158c3910fb3c2be12a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_05a5e813e1b3d2f277ed1ac1d95" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_19ba8c50b2b36af09eb72d87862" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_f22261008df274279a856bbe9c8" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482" FOREIGN KEY ("finishedRecordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_f22261008df274279a856bbe9c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_19ba8c50b2b36af09eb72d87862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_05a5e813e1b3d2f277ed1ac1d95"`,
    );
    await queryRunner.query(`DROP TABLE "chunkupload"`);
  }
}
