import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { AwsService } from 'src/services/aws/aws.service';
import {
  EmailAttachment,
  EmailService,
} from 'src/services/email/email.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { FindOptionsUtils, Repository } from 'typeorm';
import { EmailTemplate } from '../email-template.entity';
import { EmailTrigger } from './email-template-triggers';

export class TriggerEmailContext {
  public firstname: string;
  public lastname: string;
  public mobile: string;
  public email: string;
}

export type TriggeredEmail = {
  to: string;
  context: TriggerEmailContext;
  emailTemplateId: string;
  organisationId: string;
};

@Injectable()
export class EmailTemplateTriggerService {
  private readonly logger = new Logger(EmailTemplateTriggerService.name);
  constructor(
    @InjectRepository(EmailTemplate)
    public emailTemplateRepo: Repository<EmailTemplate>,
    private email: EmailService,
    private aws: AwsService,
    private locals: LocalsService,
  ) {}

  async triggerEmail<Context extends TriggerEmailContext>(
    res: Response,
    triggers: EmailTrigger[],
    context: Context,
  ) {
    const qb = this.emailTemplateRepo.createQueryBuilder('et');
    FindOptionsUtils.joinEagerRelations(
      qb,
      qb.alias,
      qb.expressionMap.mainAlias.metadata,
    );
    const templates = await qb
      .where('et.triggers I&& :triggers', { triggers: triggers })
      .getMany();

    for (const template of templates) {
      await this.sendEmail(res, template, context);
    }
  }

  async triggerOrganisationEmail<Context extends TriggerEmailContext>(
    org: Organisation,
    triggers: EmailTrigger[],
    context: Context,
  ) {
    const qb = this.emailTemplateRepo.createQueryBuilder('et');
    FindOptionsUtils.joinEagerRelations(
      qb,
      qb.alias,
      qb.expressionMap.mainAlias.metadata,
    );
    const templates = await qb
      .where(
        '(et.triggers && :triggers) AND (et.organisation = :org OR et.globalDefault IS TRUE)',
        { triggers: triggers, org: org.id },
      )
      .getMany();
    for (const template of templates) {
      await this.sendEmailWithOrg(org, template, context);
    }
  }

  async sendEmailWithOrg<Context extends TriggerEmailContext>(
    organisation: Organisation,
    template: EmailTemplate,
    context: Context,
  ) {
    if (template) {
      await this.email.sendOrganisationEmail(organisation, {
        to: context.email,
        from: template.fromAddress,
        subject: template.subject,
        content: template.content,
        data: context,
        template: template.template,
        title: template.title,
        attachments: await this.emailAttachmentsFromTemplate(template),
        cc: template.CC,
        bcc: template.BCC,
      });
    }
  }

  async sendEmail(
    res: Response,
    template: EmailTemplate,
    context: TriggerEmailContext,
  ) {
    await this.sendEmailWithOrg(
      this.locals.getOrganisation(res),
      template,
      context,
    );
  }

  async emailAttachmentsFromTemplate(
    template: EmailTemplate,
  ): Promise<EmailAttachment[]> {
    if (!template?.attachments?.length) return [];
    const ret: EmailAttachment[] = [];
    for (const attachment of template.attachments) {
      const buffer = await this.aws.getFileBuffer(attachment.record.fileUrl);

      ret.push({
        content: buffer.toString('base64'),
        filename: attachment.record.fileName,
        type: attachment.record.fileType,
        disposition: 'attachment',
      });
    }
    return ret;
  }
}
