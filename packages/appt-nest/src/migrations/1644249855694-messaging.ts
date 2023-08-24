import { MigrationInterface, QueryRunner } from 'typeorm';

export class messaging1644249855694 implements MigrationInterface {
  name = 'messaging1644249855694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_a14cff92332a94dae9e10c6b6d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "FK_1e5bc4ca54583117d61899ff231"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" RENAME COLUMN "chatter" TO "conversation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "messagingconversation_chatters_user" ("messagingconversationId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_75f1680ebee644fd607a657869c" PRIMARY KEY ("messagingconversationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3344dc048ca0633790213ca368" ON "messagingconversation_chatters_user" ("messagingconversationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17036a64e81d3975bc73ab0df2" ON "messagingconversation_chatters_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP COLUMN "inviteTemplateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02" FOREIGN KEY ("conversation") REFERENCES "messagingconversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation_chatters_user" ADD CONSTRAINT "FK_3344dc048ca0633790213ca368b" FOREIGN KEY ("messagingconversationId") REFERENCES "messagingconversation"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation_chatters_user" ADD CONSTRAINT "FK_17036a64e81d3975bc73ab0df2e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messagingconversation_chatters_user" DROP CONSTRAINT "FK_17036a64e81d3975bc73ab0df2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation_chatters_user" DROP CONSTRAINT "FK_3344dc048ca0633790213ca368b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_f9f4e03451ce3f15f25c824ea02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD "inviteTemplateId" uuid`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17036a64e81d3975bc73ab0df2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3344dc048ca0633790213ca368"`,
    );
    await queryRunner.query(`DROP TABLE "messagingconversation_chatters_user"`);
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" RENAME COLUMN "conversation" TO "chatter"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "FK_1e5bc4ca54583117d61899ff231" FOREIGN KEY ("inviteTemplateId") REFERENCES "organisationemailtemplate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_a14cff92332a94dae9e10c6b6d1" FOREIGN KEY ("chatter") REFERENCES "messagingchatters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
