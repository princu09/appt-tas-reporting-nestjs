import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { OrganisationEmailTemplateModule } from '../organisation-email-template/organisation-email-template.module';
import { Record } from '../record/record.entity';
import { RecordModule } from '../record/record.module';
import { EmailTemplateAttachments } from './email-template-attachments.entity';
import { EmailTemplateTriggerModule } from './email-template-trigger/email-template-trigger.module';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateService } from './email-template.service';

@Module({
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
  imports: [
    TypeOrmModule.forFeature([EmailTemplate, Record, EmailTemplateAttachments]),
    PermissionsModule,
    EmailTemplateTriggerModule,
    RecordModule,
    OrganisationEmailTemplateModule,
  ],
})
export class EmailTemplateModule {}
