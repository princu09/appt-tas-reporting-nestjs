import { MigrationInterface, QueryRunner } from 'typeorm';

export class media1646407993352 implements MigrationInterface {
  name = 'media1646407993352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "colorHex" character varying, "color" character varying, "description" character varying, "authorUrl" character varying, "authorImageUrl" character varying, "featuredImageUrl" character varying, "sort" integer DEFAULT '0', "public" boolean NOT NULL DEFAULT false, "published" boolean NOT NULL DEFAULT false, "author" character varying, "title" character varying, "icon" jsonb, "recordId" uuid, "parentId" uuid, CONSTRAINT "REL_654be1f970850ab5b0acfc13a9" UNIQUE ("recordId"), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "MediaRestriction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "mediaId" uuid NOT NULL, "subscriptionId" uuid, "roleId" uuid, "userDeniedId " uuid, CONSTRAINT "REL_e658fae3011dcdd6b55ee2272a" UNIQUE ("subscriptionId"), CONSTRAINT "REL_e76daffc224f1a7e8bf748f017" UNIQUE ("roleId"), CONSTRAINT "REL_acaad8292196b42cc9a59ba5b5" UNIQUE ("userDeniedId "), CONSTRAINT "PK_c72b0cbcffd52e25f222bbd9077" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "media_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_973adbf5c62cab758c53a7523eb" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4044abad04379047d296b8bbd8" ON "media_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e2533444b03507af1e86bfc39a" ON "media_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_ac4fa90f12465c02c1287cc8ae4" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_233d903fffdfb9bb36053d03336" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_fda6e313cfda165ee91ff61e0fb" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_eb7d844b9d1734284203fbf5087" FOREIGN KEY ("parentId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_32441a4e95265897344b2a734b1" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_b138d24a8930857d333bad9d70f" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_5491c0892e2f5e95524b1a0c2cd" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_e658fae3011dcdd6b55ee2272ad" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_e76daffc224f1a7e8bf748f017c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" ADD CONSTRAINT "FK_acaad8292196b42cc9a59ba5b5f" FOREIGN KEY ("userDeniedId ") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media_closure" ADD CONSTRAINT "FK_4044abad04379047d296b8bbd83" FOREIGN KEY ("id_ancestor") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media_closure" ADD CONSTRAINT "FK_e2533444b03507af1e86bfc39a6" FOREIGN KEY ("id_descendant") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "media_closure" DROP CONSTRAINT "FK_e2533444b03507af1e86bfc39a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media_closure" DROP CONSTRAINT "FK_4044abad04379047d296b8bbd83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_acaad8292196b42cc9a59ba5b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_e76daffc224f1a7e8bf748f017c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_e658fae3011dcdd6b55ee2272ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_856cb5a8c1e65913e9eb845986a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_5491c0892e2f5e95524b1a0c2cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_b138d24a8930857d333bad9d70f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "MediaRestriction" DROP CONSTRAINT "FK_32441a4e95265897344b2a734b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_eb7d844b9d1734284203fbf5087"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_654be1f970850ab5b0acfc13a9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_fda6e313cfda165ee91ff61e0fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_233d903fffdfb9bb36053d03336"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_ac4fa90f12465c02c1287cc8ae4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e2533444b03507af1e86bfc39a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4044abad04379047d296b8bbd8"`,
    );
    await queryRunner.query(`DROP TABLE "media_closure"`);
    await queryRunner.query(`DROP TABLE "MediaRestriction"`);
    await queryRunner.query(`DROP TABLE "media"`);
  }
}
