import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { AwsModule } from 'src/services/aws/aws.module';
import { EmailService } from 'src/services/email/email.service';
import { EmailTemplate } from '../email-template.entity';
import { EmailTemplateTriggerDelayed } from './email-template-delayed.entity';
import { EmailTemplateTriggerService } from './email-template-trigger.service';

@Module({
  providers: [EmailTemplateTriggerService, EmailService],
  exports: [EmailTemplateTriggerService],
  imports: [
    TypeOrmModule.forFeature([
      EmailTemplate,
      EmailTemplateTriggerDelayed,
      Organisation,
    ]),
    AwsModule,
  ],
})
export class EmailTemplateTriggerModule {}
