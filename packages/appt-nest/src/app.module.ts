import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApptLedgerModule } from './appt-ledger/appt-ledger.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AutoResourceModule } from './auto-resources/auto-resources.module';
import { Calendareventattendees } from './auto-resources/calendar-event-attendees/calendareventattendees.entity';
import { Calendarevent } from './auto-resources/calendar-event/calendar-event.entity';
import { EmailTemplateTriggerModule } from './auto-resources/email-template/email-template-trigger/email-template-trigger.module';
import { EmailTemplateModule } from './auto-resources/email-template/email-template.module';
import { Organisation } from './auto-resources/organisation/organisation.entity';
import { Roleuser } from './auto-resources/role-user/role-user.entity';
import { Siteadmin } from './auto-resources/site-admin/site-admin.entity';
import { Siteuser } from './auto-resources/site-user/site-user.entity';
import { Site } from './auto-resources/site/site.entity';
import { User } from './auto-resources/user/user.entity';
import { CsvToEntityService } from './csv-to-entity/csv-to-entity.service';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { EntityToPdfService } from './entity-to-pdf/entity-to-pdf.service';
import { validate } from './env.validate';
import { GdprModule } from './gdpr/gdpr.module';
import { GlobalModule } from './global/global.module';
import { LeaderBoardModule } from './leader-board/leader-board.module';
import { MessagingModule } from './messaging/messaging.module';
import { ApitokenMiddleware } from './middleware/apitoken.middleware';
import { JsonBodyMiddleware } from './middleware/json-body.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { OrganisationMiddleware } from './middleware/organisation.middleware';
import { PermissionsMiddleware } from './middleware/permissions.middleware';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';
import { SailsRequestMiddleware } from './middleware/sails-request.middleware';
import { SiteMiddleware } from './middleware/site.middleware';
import { PingController } from './ping/ping.controller';
import { ScheduleWrapper } from './schedule/schedule.module';
import { AwsModule } from './services/aws/aws.module';
import { EmailModule } from './services/email/email.module';
import { EmailService } from './services/email/email.service';
import { PermissionsModule } from './services/permissions/permissions.module';
import { PermissionsService } from './services/permissions/permissions.service';
import { PushService } from './services/push/push.service';
import { SmsService } from './services/sms/sms.service';
import { StripeModule } from './stripe/stripe.module';
import { TestFormModule } from './test-form/test-form.module';
import { TransAtlanticModule } from './trans-atlantic/trans-atlantic.module';
import { ValidatorModule } from './validator/validator.module';

@Module({
  imports: [
    ScheduleWrapper.forRoot(),
    ConfigModule.forRoot({
      validate,
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:
        process.env.NODE_ENV === 'test'
          ? 'localhost'
          : process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username:
        process.env.NODE_ENV === 'test'
          ? 'postgres'
          : process.env.TYPEORM_USERNAME,
      password:
        process.env.NODE_ENV === 'test' ? 'root' : process.env.TYPEORM_PASSWORD,
      database:
        process.env.NODE_ENV === 'test'
          ? 'testdb'
          : process.env.TYPEORM_DATABASE,
      entities:
        process.env.NODE_ENV === 'test'
          ? [
              join(__dirname, '**', '*.entity.{ts,js}'),
              join(__dirname, '../test/**/', '*.entity.{ts,js}'),
            ]
          : [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      migrationsRun: !(process.env.NODE_ENV === 'test'),
      migrationsTableName: 'nest_migrations',
      migrations:
        process.env.NODE_ENV === 'test'
          ? ['src/migrations/*.ts']
          : ['dist/migrations/*.js'],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      Roleuser,
      Organisation,
      User,
      Site,
      Siteuser,
      Siteadmin,
      Calendarevent,
      Calendareventattendees,
    ]),

    LeaderBoardModule,

    // Project specific
    //#################
    TransAtlanticModule,

    GdprModule,
    GlobalModule,
    AuthenticationModule,
    ValidatorModule,
    EmailTemplateModule,
    EmailTemplateTriggerModule,
    PermissionsModule,
    AutoResourceModule,
    AwsModule,
    EmailModule,
    MessagingModule,
    ApptLedgerModule,
    StripeModule,
    DynamicFormModule,
    TestFormModule,
  ],
  controllers: [AppController, PingController],
  providers: [
    AppService,
    PermissionsService,
    SmsService,
    EmailService,
    PushService,
    CsvToEntityService,
    EntityToPdfService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SailsRequestMiddleware)
      .forRoutes('flytt-core-controller')
      .apply(ApitokenMiddleware)
      .exclude('flytt-core-controller')
      .forRoutes('*')
      .apply(OrganisationMiddleware)
      .exclude('flytt-core-controller')
      .forRoutes('*')
      .apply(SiteMiddleware)
      .exclude('flytt-core-controller')
      .forRoutes('*')
      .apply(PermissionsMiddleware)
      .exclude('flytt-core-controller')
      .forRoutes('*')
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/stripe/webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*')
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
