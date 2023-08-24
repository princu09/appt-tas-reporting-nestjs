import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateTriggerModule } from 'src/auto-resources/email-template/email-template-trigger/email-template-trigger.module';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { RecordModule } from 'src/auto-resources/record/record.module';
import { Siteadmin } from 'src/auto-resources/site-admin/site-admin.entity';
import { Siteuser } from 'src/auto-resources/site-user/site-user.entity';
import { Site } from 'src/auto-resources/site/site.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  imports: [
    TypeOrmModule.forFeature([User, Organisation, Site, Siteadmin, Siteuser]),
    EmailTemplateTriggerModule,
    RecordModule,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
