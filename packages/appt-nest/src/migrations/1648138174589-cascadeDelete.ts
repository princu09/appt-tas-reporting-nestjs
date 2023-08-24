import { MigrationInterface, QueryRunner } from 'typeorm';

export class cascadeDelete1648138174589 implements MigrationInterface {
  name = 'cascadeDelete1648138174589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_073180c13f38b3575c5d4c19536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_87c214454b47e63ceead212737e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_42071de20bb698f8b759c492ddd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02" FOREIGN KEY ("conversation") REFERENCES "messagingconversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_073180c13f38b3575c5d4c19536" FOREIGN KEY ("event") REFERENCES "calendarevent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482" FOREIGN KEY ("finishedRecordId") REFERENCES "record"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f" FOREIGN KEY ("subject") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_87c214454b47e63ceead212737e" FOREIGN KEY ("submission") REFERENCES "formsubmission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_42071de20bb698f8b759c492ddd" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_42071de20bb698f8b759c492ddd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_87c214454b47e63ceead212737e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" DROP CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_073180c13f38b3575c5d4c19536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_42071de20bb698f8b759c492ddd" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_87c214454b47e63ceead212737e" FOREIGN KEY ("submission") REFERENCES "formsubmission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f" FOREIGN KEY ("subject") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chunkupload" ADD CONSTRAINT "FK_d56f8f4ed347ff7997a4d03c482" FOREIGN KEY ("finishedRecordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_073180c13f38b3575c5d4c19536" FOREIGN KEY ("event") REFERENCES "calendarevent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02" FOREIGN KEY ("conversation") REFERENCES "messagingconversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
