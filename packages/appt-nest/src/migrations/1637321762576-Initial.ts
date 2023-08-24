import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1637321762576 implements MigrationInterface {
  name = 'Initial1637321762576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(255), "password" character varying(255), "email" character varying(255), "verifyemailtoken" character varying(255), "passwordResetToken" character varying(255), "changepassword" boolean, "mobile" character varying(255), "firstname" character varying(255), "lastname" character varying(255), "devicetoken" character varying(255), "deleted" boolean, "apprated" boolean, "emailverified" boolean, "touchid" character varying(255), "backendcurrentorganisation" integer, "isdeveloper" boolean NOT NULL DEFAULT '0', "enabledbcache" boolean DEFAULT '0', "reference" character varying(255), "ethnicity" character varying(255), "gender" character varying(255), "jobTitle" character varying(255), "type" character varying(255) DEFAULT 'user', "dob" TIMESTAMP, "verificationExpires" TIMESTAMP, "verificationCode" integer, "isglobaladmin" boolean DEFAULT '0', "addressLineOne" character varying(255), "addressLineTwo" character varying(255), "city" character varying(255), "postcode" character varying(255), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "username" ON "user" ("username") `,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "email" ON "user" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "organisation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255), "deleted" boolean, "primarycolour" character varying(255), "secondarycolour" character varying(255), "logourl" character varying(255), "appsettings" text, "bundleid" character varying(255), "appuniversallink" character varying(255), "appstoreid" character varying(255), "androidpackageid" character varying(255), "appleappstorelink" character varying(255), "androidappstorelink" character varying(255), "enabledmodules" text, "tertiaryColour" character varying(255), "privacypolicy" text, "readmoretext" text, "public" boolean DEFAULT '0', "contentIsPublic" boolean DEFAULT '0', "emailToSendNotifications" character varying(255), "sharedAppOwner" boolean DEFAULT '0', "hasCustomApp" boolean DEFAULT '0', "addressLineOne" character varying(150), "addressLineTwo" character varying(150), "postcode" character varying(10), "city" character varying(150), "customdomain" character varying(40), "subscription" integer, "active" boolean, "admin" uuid, "hassites" boolean DEFAULT '0', "numallowedusers" integer DEFAULT '1000', "notes" text, CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "site" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255), "notes" text, "address" character varying(255), "postcode" character varying(255), "city" character varying(255), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "apitoken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "token" character varying(255), "valid" boolean NOT NULL, "public" boolean, CONSTRAINT "PK_f4ae473a5df1c61450f23328ca1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audittrail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "type" character varying(25), "key" character varying(25), "description" character varying(255), "subject" uuid, "restricted" boolean, "additionalData" text, CONSTRAINT "PK_ea39c91bdd366094aa8480d5adf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "calendarevent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" character varying(255), "locationURL" character varying(1024), "locationCoordinates" character varying(1024), "startTime" TIMESTAMP NOT NULL, "duration" character varying(255), "cancelled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1a120edc9debc2d29d74c53b7be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "calendareventattendees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "attendanceStatus" character varying(255), "event" uuid, "attendee" uuid, CONSTRAINT "PK_e312bed49f8a44c89879cd53843" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "formresponse" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "submission" integer, "questionkey" character varying(255), "questiontext" character varying(255), "response" text, "responsetype" character varying(20), "hasbeenderived" boolean NOT NULL DEFAULT false, "isderived" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f7e21a9ad2d7ae69837354ee09a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "formsubmission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "type" character varying(25), "reference" character varying(255), "status" character varying(10), "subject" uuid, "pdfUrl" character varying(255), "uuid" character varying(36), "processed" boolean DEFAULT '0', CONSTRAINT "PK_efdbb168b75395182a23d182922" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messagingconversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" character varying(1024), CONSTRAINT "PK_2968d7a2ec7fd5755bb4a66d519" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messagingchatters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "active" boolean NOT NULL DEFAULT false, "conversation" uuid NOT NULL, CONSTRAINT "PK_88ccb6fb9f3c25e077dd18b67e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messagingmessage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "message" text, "chatter" uuid NOT NULL, CONSTRAINT "PK_3b07e7666f1c4011cf993d9a298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "metadata" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "objId" integer, "key" character varying(1024), "value" character varying(1024), "type" character varying(1024), CONSTRAINT "PK_56b22355e89941b9792c04ab176" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "status" character varying(10), "intentId" character varying(255), "clientSecret" character varying(255), "fullStripeIntent" text, "paymentAmount" integer, "subscription" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationsubscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" character varying(255), "friendlyDescription" character varying(255), "statementDescription" character varying(20), "annualFee" integer, "numAllowedUsers" integer, CONSTRAINT "PK_8513af61de0dd667f3fb5d44f22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationsystemtag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "type" character varying(25), "key" character varying(25), "value" text, "fieldtype" character varying(20), CONSTRAINT "PK_05874fb64fb414b2c809ab5572d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisationtag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "type" character varying(25), "key" character varying(25), "value" text, "fieldtype" character varying(20), CONSTRAINT "PK_1201a5346ae19e9299e2d402b02" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "fileName" character varying(2048) NOT NULL, "fileURL" character varying(2048) NOT NULL, "fileType" character varying(10) NOT NULL, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "title" character varying(255), "permissions" text, "defaultrole" boolean, "hidden" boolean, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roleuser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "role" uuid NOT NULL, CONSTRAINT "PK_68c1de684575f4bf98380af5a28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "siteadmin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, CONSTRAINT "PK_ccee76a4a92251793d9d89a2735" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "siteuser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, CONSTRAINT "PK_7bbcae9074757a9777f86a730e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "statapirequest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "endpoint" character varying(255), "responseStatus" integer, "method" character varying(255), "currentOrganisation" character varying(255), "appVersionNumber" character varying(255), "appBuildNumber" character varying(255), "appBundleId" character varying(255), "os" character varying(255), "osVersion" character varying(255), "deviceModel" character varying(255), CONSTRAINT "PK_51195327d508c5893b7d16497dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "title" character varying(255), "description" text, "appleId" character varying(255), "googleId" character varying(255), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptionreceipt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "subscription" uuid NOT NULL, "provider" character varying(255), "reference" character varying(255), "date" TIMESTAMP, CONSTRAINT "PK_4fe0d276168c352087d1e92242a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" character varying(255), "additionalData" text, "type" character varying(255), "status" character varying(255), "description" text, "completedBy" TIMESTAMP, "notifyAt" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "token" character varying(255), "type" character varying(255), "user" integer, "expires" TIMESTAMP, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "uploadchunk" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "filename" character varying(255), "uploadid" character varying(255), "index" integer, "totalchunks" integer, "etag" character varying(255), "filepath" character varying(255), CONSTRAINT "PK_84b671d09cf860d5aa9eac312dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "userdirectaccess" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "targetuser" uuid NOT NULL, "usergrantedaccess" uuid NOT NULL, CONSTRAINT "PK_d877ad6d5e0fc38184050a51f4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usergroup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "name" character varying(255), "description" text, "type" character varying(55), CONSTRAINT "PK_a5c402b112d56d89a5b6ca69dc7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usergroupadmin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "usergroup" uuid NOT NULL, CONSTRAINT "PK_d05557271d69746fa42bb1225e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usergroupmember" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "usergroup" uuid NOT NULL, CONSTRAINT "PK_908e9dc775d2b98b9e55ed383b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usernotification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "message" character varying(1024), "read" boolean, "recipient" uuid NOT NULL, CONSTRAINT "PK_f9113ad8b473ce4762ec147c5d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usertag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "type" character varying(25), "key" character varying(25), "value" text, "fieldtype" character varying(20), "sensitivity" character varying(15), CONSTRAINT "PK_51029928879e0a9003d42afee46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "subject" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_93e154861ebe970688b829e345b" UNIQUE ("subject"), CONSTRAINT "PK_20a29edcd85d90a89111ed6a190" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "status" "public"."notification_status_enum" NOT NULL DEFAULT '0', "senderId" uuid, "targetUserId" uuid, "targetOrganisationId" uuid, "targetSiteId" uuid, "subject" text NOT NULL, "body" text NOT NULL, "data" text, "permissionId" uuid, "type" "public"."notification_type_enum" NOT NULL, "timeToSend" TIMESTAMP, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_notification_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "permissionId" uuid, "canSend" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1393522449d7218ea404bbe9c66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_device_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "organisation" uuid NOT NULL, "site" uuid, "deviceToken" text NOT NULL, CONSTRAINT "unique_index_1" UNIQUE ("owner", "organisation", "site"), CONSTRAINT "PK_a168517a166d3a4fa4e13790442" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_363bd896c9058b80b0bbf1a17b" ON "user_device_token" ("deviceToken") `,
    );
    await queryRunner.query(
      `CREATE TABLE "testautoapi" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "someNumber" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid, "organisation" uuid, "site" uuid, CONSTRAINT "PK_c5247c9def8a70440d7d9a10b87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisation_users_user" ("organisationId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_eac8f9e5df621f9316babe31ff0" PRIMARY KEY ("organisationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3fd33a53717959eaca3284edc9" ON "organisation_users_user" ("organisationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_261fa3d243508bfc94e45405e2" ON "organisation_users_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role_users_user" ("roleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_46403d6ce64cde119287c876ca3" PRIMARY KEY ("roleId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ed6edac7184b013d4bd58d60e5" ON "role_users_user" ("roleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a88fcb405b56bf2e2646e9d479" ON "role_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "FK_d7d7fbbd5c3693181e4a1ba027b" FOREIGN KEY ("admin") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_bd32983208ceca4dd9afa882d88" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" ADD CONSTRAINT "FK_05dcead745e012dc7fc5465c78f" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" ADD CONSTRAINT "FK_5ba1d72db0062fc0eb84f15054c" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" ADD CONSTRAINT "FK_aa947367265215fdd1a4d2d37ed" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" ADD CONSTRAINT "FK_4b94a32add8133704bcaee91cbe" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" ADD CONSTRAINT "FK_3574cb9df6eace257efb20811a3" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" ADD CONSTRAINT "FK_2ad44b5997619e721ad8914e3f9" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" ADD CONSTRAINT "FK_99434fe4a7387c9d10573e65d65" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" ADD CONSTRAINT "FK_6d36eb751081caf90860d5b9221" FOREIGN KEY ("subject") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" ADD CONSTRAINT "FK_d28c3ee44f44cd1b4cc88df0bce" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" ADD CONSTRAINT "FK_551772bd9512007b4af786356ff" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" ADD CONSTRAINT "FK_1643b7972a5db192451dfef895e" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_9b4c1a67b89d714c235343e4e94" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_5c5a21f81f0f5e9eea5296c55e8" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_e55f795950d23cce06ea73480e3" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_073180c13f38b3575c5d4c19536" FOREIGN KEY ("event") REFERENCES "calendarevent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" ADD CONSTRAINT "FK_b167c06a48374e2b58f1917e5c1" FOREIGN KEY ("attendee") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_d0ad8f5c7f601c6d0297da6e375" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_143e95db5ae8e88f2539645afc9" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" ADD CONSTRAINT "FK_e80ae199941adbd83f373f3d3bd" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_d90827cdaa4968c783eddd94cb6" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_37c342683fe2389bbb074748b3c" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_c8985fa786cbccdb54d75f506f1" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" ADD CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f" FOREIGN KEY ("subject") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" ADD CONSTRAINT "FK_32b0b2408a9d562c794d57400a9" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" ADD CONSTRAINT "FK_fa2372c0dccf4b3b167dc90140a" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" ADD CONSTRAINT "FK_110b7f15b3926696b47b591c7e9" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" ADD CONSTRAINT "FK_88029f124f149deaf4840892105" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" ADD CONSTRAINT "FK_36f72953e9adb362db60f454864" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" ADD CONSTRAINT "FK_cec99dfb805697f1e7c6a6ea29d" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" ADD CONSTRAINT "FK_32dd35ade082596ea9e5b3da722" FOREIGN KEY ("conversation") REFERENCES "messagingconversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_f3b823663602286c23272b3823b" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_756e9a9efd23760107cb8c333da" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_47aa06c15ddcee4ff630cd9427c" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" ADD CONSTRAINT "FK_a14cff92332a94dae9e10c6b6d1" FOREIGN KEY ("chatter") REFERENCES "messagingchatters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" ADD CONSTRAINT "FK_1de928600b56dcf183099cb1404" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" ADD CONSTRAINT "FK_3e8ef8f3685702974954f431d54" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" ADD CONSTRAINT "FK_c82e4b95e589fef5b0741b887a2" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_cc266abff2526389bc829bfe1fb" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_25c86238406a5e3508e620fb737" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_50e46c9bda16884ad88f31e2270" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" ADD CONSTRAINT "FK_65ee460e7c502aefdfda4128868" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" ADD CONSTRAINT "FK_6991b496e9df264368375f9a144" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" ADD CONSTRAINT "FK_f323d107816658738ffc5f24e4f" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" ADD CONSTRAINT "FK_5163b214dc634b022ecbe1af9c9" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" ADD CONSTRAINT "FK_cc6feda2037be802fe97ec3ea58" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" ADD CONSTRAINT "FK_674b9d3f4ba8cb7b2a440825cc7" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" ADD CONSTRAINT "FK_e51b3bd85dee06477cafeaa70d1" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" ADD CONSTRAINT "FK_5d5ff80887b78873589744e5f25" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" ADD CONSTRAINT "FK_a2104fc457f7c707c74a6b9aefb" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_024b2f58b2b3e4a51fa93a243d4" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_751c3fbb32cea66fa739e9750a6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" ADD CONSTRAINT "FK_161f4639ce9a9fa218b9a7d724a" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_9402b4b41fdda2ca3099172b4e1" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_716970ac179307aecb5a1da0ec3" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_8ceff5ecf8d0661154ba3ae3382" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" ADD CONSTRAINT "FK_c397a0bdf7b66ab4fcfaaaa1449" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" ADD CONSTRAINT "FK_c7aa830c62927d4de3a226edda7" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" ADD CONSTRAINT "FK_fc6a382c4c5f907688565e10fd0" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" ADD CONSTRAINT "FK_64481c5c984048eaa3d6e7e1956" FOREIGN KEY ("role") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" ADD CONSTRAINT "FK_5cf98b1cea0820218be6b3b0a6f" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" ADD CONSTRAINT "FK_172ac3ff574fd0777f2f7673f54" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" ADD CONSTRAINT "FK_34261d51aed503feeadfd0114c9" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" ADD CONSTRAINT "FK_7112f9c09dbae2290593236fd9e" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" ADD CONSTRAINT "FK_47e29202b7de4057530430efb66" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" ADD CONSTRAINT "FK_f056a0b19a922f52e55c98f5c6e" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" ADD CONSTRAINT "FK_2769d5295611fca8d33b7e0d794" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" ADD CONSTRAINT "FK_3f25da382a83b2bf62d89155531" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" ADD CONSTRAINT "FK_0a03b783561333e31063a5042de" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_9b86c2c6d96e63b6efd804c8ac9" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_b03fee6876c4bebd4b94c42e653" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_cb896287d5a60c517601826d5ea" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" ADD CONSTRAINT "FK_e7b973e9750e73a95da564fb402" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" ADD CONSTRAINT "FK_8fe94ab70ca623812ffd6325dbc" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" ADD CONSTRAINT "FK_bafa40d22046fe839044cd6bbe6" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" ADD CONSTRAINT "FK_eaacda6f1b14347d80f69c55aa5" FOREIGN KEY ("subscription") REFERENCES "subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_da698c3e13462ea9a8fc5e8e251" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_7cb11f91cee3a314baa42f1df82" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_d0c8c8f1bb4a5e1cb8535415de7" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_6617bb96cbce3c4330f6ba16116" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_1ae1b34ed54c0cd54bb36c8dfc6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_fda0149ac8afd01fa8f8e6e02cb" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" ADD CONSTRAINT "FK_889e959bf0caa482858a01c1168" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" ADD CONSTRAINT "FK_aa6c8b41c3519fef8c92b642ef0" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" ADD CONSTRAINT "FK_e61da14b05edb5e596dcc17c796" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" ADD CONSTRAINT "FK_0c84b2d1a267a7ad2979fe9d9be" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" ADD CONSTRAINT "FK_2b8b586854b2e15cb654e0abaa0" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" ADD CONSTRAINT "FK_7db91d85ecf0c55410e0363c421" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" ADD CONSTRAINT "FK_fc174a65c1d68314b21649f5914" FOREIGN KEY ("targetuser") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" ADD CONSTRAINT "FK_eae589a92fd454dbc4c0d05671b" FOREIGN KEY ("usergrantedaccess") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" ADD CONSTRAINT "FK_f10c45a82fc37d9ff3f08dd232d" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" ADD CONSTRAINT "FK_2fb85c3b95fa01307c5e546146c" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" ADD CONSTRAINT "FK_e8af1df6b51a1923f9c9b550b0e" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" ADD CONSTRAINT "FK_94f12e9a8d7042f2750937206b7" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" ADD CONSTRAINT "FK_6690040f3a63070438aa79e8b14" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" ADD CONSTRAINT "FK_f4aac05cececb6992c4ce6edf86" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" ADD CONSTRAINT "FK_a0040189b70c544d4d07a2736c3" FOREIGN KEY ("usergroup") REFERENCES "usergroup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" ADD CONSTRAINT "FK_77b1deebef7102de8416c1cc5bf" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" ADD CONSTRAINT "FK_921604539f6e879a20aea851085" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" ADD CONSTRAINT "FK_1b5ae92072e68e353b0ef2fffc3" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" ADD CONSTRAINT "FK_ec7d9d18f844b08411b7f61accb" FOREIGN KEY ("usergroup") REFERENCES "usergroup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD CONSTRAINT "FK_7bcd750246267df3b6cb6284652" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD CONSTRAINT "FK_6f7552cd1fa6dd2ed0ee3bdc281" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD CONSTRAINT "FK_ad755556f3c280af7486dc71382" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" ADD CONSTRAINT "FK_3ada4136d78464a3fa8b53a5aa5" FOREIGN KEY ("recipient") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" ADD CONSTRAINT "FK_e92c200f8398ba915821a4aff48" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" ADD CONSTRAINT "FK_62951a0887364b1bbd60d9d58d4" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" ADD CONSTRAINT "FK_b7ab98f8e24ee993e9ff278664f" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" ADD CONSTRAINT "FK_de04013f987e7f9c9d258298b42" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" ADD CONSTRAINT "FK_a274a156ff849c0404c38c63ac6" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" ADD CONSTRAINT "FK_445aba1237f16cdf7335d5e73d6" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_95f45085db085cbc4b40394f949" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_2950eb773ef8807afdd88301ac9" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_c37d1f7f812fbb42fc3674c1a30" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_42071de20bb698f8b759c492ddd" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_8836431f1a84efaa34e8eaba5cb" FOREIGN KEY ("targetOrganisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_44344bc926ffbcb4991bd820291" FOREIGN KEY ("targetSiteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_6c23f63eba2dff318446816c517" FOREIGN KEY ("permissionId") REFERENCES "notification_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" ADD CONSTRAINT "FK_31d1d660803ae96627bd3aee3bd" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" ADD CONSTRAINT "FK_86ceee0c26837fab4059d2b23a3" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" ADD CONSTRAINT "FK_91900b741d4ffe03f6d4499cd7b" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" ADD CONSTRAINT "FK_6bc694435141de73f49bd1adf47" FOREIGN KEY ("permissionId") REFERENCES "notification_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" ADD CONSTRAINT "FK_c21971556b433f0d92f3c69528c" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" ADD CONSTRAINT "FK_2ac70bc10d61abc1f443230c171" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" ADD CONSTRAINT "FK_58b6195fee552c4fe04498ce6fd" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" ADD CONSTRAINT "FK_39a59287387050f81ad7ad6faeb" FOREIGN KEY ("owner") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" ADD CONSTRAINT "FK_2bf5f4258c845af6ee942d3046e" FOREIGN KEY ("organisation") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" ADD CONSTRAINT "FK_24153191d3ae522f1421687cbbe" FOREIGN KEY ("site") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_3fd33a53717959eaca3284edc98" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" ADD CONSTRAINT "FK_261fa3d243508bfc94e45405e23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users_user" ADD CONSTRAINT "FK_ed6edac7184b013d4bd58d60e54" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users_user" ADD CONSTRAINT "FK_a88fcb405b56bf2e2646e9d4797" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_a88fcb405b56bf2e2646e9d4797"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_ed6edac7184b013d4bd58d60e54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_261fa3d243508bfc94e45405e23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation_users_user" DROP CONSTRAINT "FK_3fd33a53717959eaca3284edc98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" DROP CONSTRAINT "FK_24153191d3ae522f1421687cbbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" DROP CONSTRAINT "FK_2bf5f4258c845af6ee942d3046e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "testautoapi" DROP CONSTRAINT "FK_39a59287387050f81ad7ad6faeb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" DROP CONSTRAINT "FK_58b6195fee552c4fe04498ce6fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" DROP CONSTRAINT "FK_2ac70bc10d61abc1f443230c171"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device_token" DROP CONSTRAINT "FK_c21971556b433f0d92f3c69528c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" DROP CONSTRAINT "FK_6bc694435141de73f49bd1adf47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" DROP CONSTRAINT "FK_91900b741d4ffe03f6d4499cd7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" DROP CONSTRAINT "FK_86ceee0c26837fab4059d2b23a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notification_permission" DROP CONSTRAINT "FK_31d1d660803ae96627bd3aee3bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_6c23f63eba2dff318446816c517"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_44344bc926ffbcb4991bd820291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_8836431f1a84efaa34e8eaba5cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_42071de20bb698f8b759c492ddd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_c37d1f7f812fbb42fc3674c1a30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_2950eb773ef8807afdd88301ac9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_95f45085db085cbc4b40394f949"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" DROP CONSTRAINT "FK_445aba1237f16cdf7335d5e73d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" DROP CONSTRAINT "FK_a274a156ff849c0404c38c63ac6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_permission" DROP CONSTRAINT "FK_de04013f987e7f9c9d258298b42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" DROP CONSTRAINT "FK_b7ab98f8e24ee993e9ff278664f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" DROP CONSTRAINT "FK_62951a0887364b1bbd60d9d58d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usertag" DROP CONSTRAINT "FK_e92c200f8398ba915821a4aff48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP CONSTRAINT "FK_3ada4136d78464a3fa8b53a5aa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP CONSTRAINT "FK_ad755556f3c280af7486dc71382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP CONSTRAINT "FK_6f7552cd1fa6dd2ed0ee3bdc281"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usernotification" DROP CONSTRAINT "FK_7bcd750246267df3b6cb6284652"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" DROP CONSTRAINT "FK_ec7d9d18f844b08411b7f61accb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" DROP CONSTRAINT "FK_1b5ae92072e68e353b0ef2fffc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" DROP CONSTRAINT "FK_921604539f6e879a20aea851085"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupmember" DROP CONSTRAINT "FK_77b1deebef7102de8416c1cc5bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" DROP CONSTRAINT "FK_a0040189b70c544d4d07a2736c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" DROP CONSTRAINT "FK_f4aac05cececb6992c4ce6edf86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" DROP CONSTRAINT "FK_6690040f3a63070438aa79e8b14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroupadmin" DROP CONSTRAINT "FK_94f12e9a8d7042f2750937206b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" DROP CONSTRAINT "FK_e8af1df6b51a1923f9c9b550b0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" DROP CONSTRAINT "FK_2fb85c3b95fa01307c5e546146c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usergroup" DROP CONSTRAINT "FK_f10c45a82fc37d9ff3f08dd232d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" DROP CONSTRAINT "FK_eae589a92fd454dbc4c0d05671b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" DROP CONSTRAINT "FK_fc174a65c1d68314b21649f5914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" DROP CONSTRAINT "FK_7db91d85ecf0c55410e0363c421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" DROP CONSTRAINT "FK_2b8b586854b2e15cb654e0abaa0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "userdirectaccess" DROP CONSTRAINT "FK_0c84b2d1a267a7ad2979fe9d9be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" DROP CONSTRAINT "FK_e61da14b05edb5e596dcc17c796"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" DROP CONSTRAINT "FK_aa6c8b41c3519fef8c92b642ef0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "uploadchunk" DROP CONSTRAINT "FK_889e959bf0caa482858a01c1168"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_fda0149ac8afd01fa8f8e6e02cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_1ae1b34ed54c0cd54bb36c8dfc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_6617bb96cbce3c4330f6ba16116"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_d0c8c8f1bb4a5e1cb8535415de7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_7cb11f91cee3a314baa42f1df82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_da698c3e13462ea9a8fc5e8e251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" DROP CONSTRAINT "FK_eaacda6f1b14347d80f69c55aa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" DROP CONSTRAINT "FK_bafa40d22046fe839044cd6bbe6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" DROP CONSTRAINT "FK_8fe94ab70ca623812ffd6325dbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptionreceipt" DROP CONSTRAINT "FK_e7b973e9750e73a95da564fb402"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_cb896287d5a60c517601826d5ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_b03fee6876c4bebd4b94c42e653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" DROP CONSTRAINT "FK_9b86c2c6d96e63b6efd804c8ac9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" DROP CONSTRAINT "FK_0a03b783561333e31063a5042de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" DROP CONSTRAINT "FK_3f25da382a83b2bf62d89155531"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statapirequest" DROP CONSTRAINT "FK_2769d5295611fca8d33b7e0d794"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" DROP CONSTRAINT "FK_f056a0b19a922f52e55c98f5c6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" DROP CONSTRAINT "FK_47e29202b7de4057530430efb66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteuser" DROP CONSTRAINT "FK_7112f9c09dbae2290593236fd9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" DROP CONSTRAINT "FK_34261d51aed503feeadfd0114c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" DROP CONSTRAINT "FK_172ac3ff574fd0777f2f7673f54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "siteadmin" DROP CONSTRAINT "FK_5cf98b1cea0820218be6b3b0a6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" DROP CONSTRAINT "FK_64481c5c984048eaa3d6e7e1956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" DROP CONSTRAINT "FK_fc6a382c4c5f907688565e10fd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" DROP CONSTRAINT "FK_c7aa830c62927d4de3a226edda7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roleuser" DROP CONSTRAINT "FK_c397a0bdf7b66ab4fcfaaaa1449"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_8ceff5ecf8d0661154ba3ae3382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_716970ac179307aecb5a1da0ec3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_9402b4b41fdda2ca3099172b4e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_161f4639ce9a9fa218b9a7d724a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_751c3fbb32cea66fa739e9750a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record" DROP CONSTRAINT "FK_024b2f58b2b3e4a51fa93a243d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" DROP CONSTRAINT "FK_a2104fc457f7c707c74a6b9aefb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" DROP CONSTRAINT "FK_5d5ff80887b78873589744e5f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationtag" DROP CONSTRAINT "FK_e51b3bd85dee06477cafeaa70d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" DROP CONSTRAINT "FK_674b9d3f4ba8cb7b2a440825cc7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" DROP CONSTRAINT "FK_cc6feda2037be802fe97ec3ea58"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsystemtag" DROP CONSTRAINT "FK_5163b214dc634b022ecbe1af9c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" DROP CONSTRAINT "FK_f323d107816658738ffc5f24e4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" DROP CONSTRAINT "FK_6991b496e9df264368375f9a144"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisationsubscription" DROP CONSTRAINT "FK_65ee460e7c502aefdfda4128868"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_50e46c9bda16884ad88f31e2270"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_25c86238406a5e3508e620fb737"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_cc266abff2526389bc829bfe1fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" DROP CONSTRAINT "FK_c82e4b95e589fef5b0741b887a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" DROP CONSTRAINT "FK_3e8ef8f3685702974954f431d54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata" DROP CONSTRAINT "FK_1de928600b56dcf183099cb1404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_a14cff92332a94dae9e10c6b6d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_47aa06c15ddcee4ff630cd9427c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_756e9a9efd23760107cb8c333da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingmessage" DROP CONSTRAINT "FK_f3b823663602286c23272b3823b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" DROP CONSTRAINT "FK_32dd35ade082596ea9e5b3da722"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" DROP CONSTRAINT "FK_cec99dfb805697f1e7c6a6ea29d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" DROP CONSTRAINT "FK_36f72953e9adb362db60f454864"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingchatters" DROP CONSTRAINT "FK_88029f124f149deaf4840892105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" DROP CONSTRAINT "FK_110b7f15b3926696b47b591c7e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" DROP CONSTRAINT "FK_fa2372c0dccf4b3b167dc90140a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messagingconversation" DROP CONSTRAINT "FK_32b0b2408a9d562c794d57400a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_63ad5363c08282a9421c2bbab2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_c8985fa786cbccdb54d75f506f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_37c342683fe2389bbb074748b3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formsubmission" DROP CONSTRAINT "FK_d90827cdaa4968c783eddd94cb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_e80ae199941adbd83f373f3d3bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_143e95db5ae8e88f2539645afc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "formresponse" DROP CONSTRAINT "FK_d0ad8f5c7f601c6d0297da6e375"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_b167c06a48374e2b58f1917e5c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_073180c13f38b3575c5d4c19536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_e55f795950d23cce06ea73480e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_5c5a21f81f0f5e9eea5296c55e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendareventattendees" DROP CONSTRAINT "FK_9b4c1a67b89d714c235343e4e94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" DROP CONSTRAINT "FK_1643b7972a5db192451dfef895e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" DROP CONSTRAINT "FK_551772bd9512007b4af786356ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendarevent" DROP CONSTRAINT "FK_d28c3ee44f44cd1b4cc88df0bce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" DROP CONSTRAINT "FK_6d36eb751081caf90860d5b9221"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" DROP CONSTRAINT "FK_99434fe4a7387c9d10573e65d65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" DROP CONSTRAINT "FK_2ad44b5997619e721ad8914e3f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audittrail" DROP CONSTRAINT "FK_3574cb9df6eace257efb20811a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" DROP CONSTRAINT "FK_4b94a32add8133704bcaee91cbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" DROP CONSTRAINT "FK_aa947367265215fdd1a4d2d37ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "apitoken" DROP CONSTRAINT "FK_5ba1d72db0062fc0eb84f15054c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_05dcead745e012dc7fc5465c78f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "site" DROP CONSTRAINT "FK_bd32983208ceca4dd9afa882d88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "FK_d7d7fbbd5c3693181e4a1ba027b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a88fcb405b56bf2e2646e9d479"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed6edac7184b013d4bd58d60e5"`,
    );
    await queryRunner.query(`DROP TABLE "role_users_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_261fa3d243508bfc94e45405e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3fd33a53717959eaca3284edc9"`,
    );
    await queryRunner.query(`DROP TABLE "organisation_users_user"`);
    await queryRunner.query(`DROP TABLE "testautoapi"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_363bd896c9058b80b0bbf1a17b"`,
    );
    await queryRunner.query(`DROP TABLE "user_device_token"`);
    await queryRunner.query(`DROP TABLE "user_notification_permission"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notification_status_enum"`);
    await queryRunner.query(`DROP TABLE "notification_permission"`);
    await queryRunner.query(`DROP TABLE "usertag"`);
    await queryRunner.query(`DROP TABLE "usernotification"`);
    await queryRunner.query(`DROP TABLE "usergroupmember"`);
    await queryRunner.query(`DROP TABLE "usergroupadmin"`);
    await queryRunner.query(`DROP TABLE "usergroup"`);
    await queryRunner.query(`DROP TABLE "userdirectaccess"`);
    await queryRunner.query(`DROP TABLE "uploadchunk"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "subscriptionreceipt"`);
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TABLE "statapirequest"`);
    await queryRunner.query(`DROP TABLE "siteuser"`);
    await queryRunner.query(`DROP TABLE "siteadmin"`);
    await queryRunner.query(`DROP TABLE "roleuser"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "record"`);
    await queryRunner.query(`DROP TABLE "organisationtag"`);
    await queryRunner.query(`DROP TABLE "organisationsystemtag"`);
    await queryRunner.query(`DROP TABLE "organisationsubscription"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "metadata"`);
    await queryRunner.query(`DROP TABLE "messagingmessage"`);
    await queryRunner.query(`DROP TABLE "messagingchatters"`);
    await queryRunner.query(`DROP TABLE "messagingconversation"`);
    await queryRunner.query(`DROP TABLE "formsubmission"`);
    await queryRunner.query(`DROP TABLE "formresponse"`);
    await queryRunner.query(`DROP TABLE "calendareventattendees"`);
    await queryRunner.query(`DROP TABLE "calendarevent"`);
    await queryRunner.query(`DROP TABLE "audittrail"`);
    await queryRunner.query(`DROP TABLE "apitoken"`);
    await queryRunner.query(`DROP TABLE "site"`);
    await queryRunner.query(`DROP TABLE "organisation"`);
    await queryRunner.query(`DROP INDEX "public"."email"`);
    await queryRunner.query(`DROP INDEX "public"."username"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
