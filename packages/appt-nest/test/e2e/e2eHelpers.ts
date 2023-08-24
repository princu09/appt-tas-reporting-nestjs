import { createMock } from "@golevelup/ts-jest";
import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { useContainer } from "class-validator";
import { existsSync, mkdirSync } from "fs";
import Helmet from 'helmet';
import { AuthenticationService } from "src/authentication/authentication.service";
import { EmailTemplateTriggerModule } from "src/auto-resources/email-template/email-template-trigger/email-template-trigger.module";
import { EmailService } from "src/services/email/email.service";
import { Connection } from "typeorm";
import { v4 } from "uuid";
import { AppModule } from '../../src/app.module';
import { Organisation } from "../../src/auto-resources/organisation/organisation.entity";
import { Roleuser } from "../../src/auto-resources/role-user/role-user.entity";
import { Role } from "../../src/auto-resources/role/role.entity";
import { Siteadmin } from "../../src/auto-resources/site-admin/site-admin.entity";
import { Siteuser } from "../../src/auto-resources/site-user/site-user.entity";
import { Site } from "../../src/auto-resources/site/site.entity";
import { User } from "../../src/auto-resources/user/user.entity";
import { TestAutoApiModule } from './crud-test/test-code/test-auto-api.module';
import { SiteFactory } from "./factories/site.factory";
import { UserFactory } from "./factories/user.factory";
import * as cookieParser from 'cookie-parser';
const pgp = require("pg-promise")({});

export async function up() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = ''
  process.env.SENDGRID_KEY = '1'
  process.env.NOTIFICATION_FROM_EMAIL = 'alex.taylor@appt.digital'
  process.env.JWT_SECRET = '123123'
  process.env.JWT_EXP = '1hr'
  process.env.TMP_FILE_PATH = '.tmp/'
  process.env.DEFAULT_ORG_UUID = v4()

  process.env.SFTP_HOST = '127.0.0.1';
  process.env.SFTP_PORT = '2222';
  process.env.SFTP_USERNAME = 'foo';
  process.env.SFTP_PASSWORD = 'pass';

  process.env.SENDGRID_KEY="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"
  process.env.REDIS_HOST = "localhost"
  process.env.REDIS_PORT = "6379"
  
  // Check tmp file exists
  if (!existsSync(process.env.TMP_FILE_PATH)) {
    mkdirSync(process.env.TMP_FILE_PATH);
  }

  await createDB();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TestAutoApiModule,
      AppModule,
      TypeOrmModule.forFeature([User, Organisation, Roleuser, Role, Site, Siteadmin, Siteuser]),
    ],
    providers: [UserFactory, SiteFactory ]
  }).compile();



  let app = moduleFixture.createNestApplication();
  let userFactory = moduleFixture.get(UserFactory);
  let siteFactory = moduleFixture.get(SiteFactory);
  app.useLogger(createMock<Logger>());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  app.use(cookieParser());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  app.use(Helmet());
  useContainer(app, { fallbackOnErrors: true });
  await app.init();
  await app.listen(3000);
  await dbSync(app);
  return { app, userFactory, siteFactory };
}

async function createDB() {
  const conn = await pgp({
    user: 'postgres',
    password: 'root',
  });
  try {
    await conn.query(`DROP DATABASE IF EXISTS testdb WITH (FORCE)`);
  } catch (err) { }
  try {
    await conn.query(`CREATE DATABASE testdb`);
  } catch (err) { }
  await pgp.end()
}

async function cleanDB(app) {
  const connection = await app.get(Connection)
  const entities = [];
  connection.entityMetadatas.forEach(
    x => entities.push({name: x.name, tableName: x.tableName})
  );
  await cleanAll(connection, entities)
}

async function cleanAll(app, entities) {
  try {
    for (const entity of entities) {
      const repository = await app.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
      await repository.query(`ALTER TABLE \`${entity.tableName}\` AUTO_INCREMENT = 1;`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
}

export async function getUserRepo(app) {
  return app.get(getRepositoryToken(User))
}

export async function dbSync(app) {
  try {
    const connection = await app.get(Connection)
    await connection.runMigrations({
      transaction: false
    })
  } catch (err) {
    console.log(err)
  }
}

export async function down (app) {
  await app.close()
}
