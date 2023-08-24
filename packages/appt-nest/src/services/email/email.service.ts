import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as ejs from 'ejs';
import { EmailTemplateAttachments } from 'src/auto-resources/email-template/email-template-attachments.entity';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';

export type EmailAttachment = {
  content: string;
  filename: string;
  type: string;
  disposition: string;
};

export class EmailContent {
  public to: string;
  public from: string;
  public subject: string;
  public text: string;
  public html: string;
  public attachments: EmailTemplateAttachments[] | null;
}

export class TemplateData {
  public template: OrganisationEmailTemplate;
  public data: ejs.Data;
}

export class OrganisationEmail extends TemplateData {
  public to: string;
  public from: string;
  public subject: string;
  public content: string; // Goes inside of the html
  public title: string;
  public attachments: EmailAttachment[] | undefined | null;
  public cc: string | null | undefined;
  public bcc: string | null | undefined;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      sgMail.setApiKey(process.env.SENDGRID_KEY);
    }
  }

  async sendMail(msg: sgMail.MailDataRequired) {
    try {
      this.logger.log(`Sending Email: ${JSON.stringify(msg)}`);
      return await sgMail.send(msg);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async sendOrganisationEmail(
    org: Organisation,
    data: Partial<OrganisationEmail>,
  ) {
    const payload = this.populateOrgansationTemplateData(org, data);
    const emailString = await this.renderTemplate(payload, data.template);

    return await this.sendMail({
      to: data.to,
      from: data.from,
      subject: data.subject,
      text: emailString,
      html: emailString,
      attachments: data.attachments,
      ...(data.bcc && { bcc: data.bcc }),
      ...(data.cc && { cc: data.cc }),
    });
  }

  private populateOrgansationTemplateData(
    organisation: Organisation,
    data: Partial<OrganisationEmail>,
  ): ejs.Data {
    let androidAppStoreLink = process.env.SERVER_ADDRESS;
    let appleAppStoreLink = process.env.SERVER_ADDRESS;

    if (organisation?.androidappstorelink)
      androidAppStoreLink = organisation.androidappstorelink;
    if (organisation?.appleappstorelink)
      appleAppStoreLink = organisation.appleappstorelink;

    return {
      layout: false,
      title: data.title,
      primaryColour: organisation?.primarycolour,
      logo: organisation?.logo?.fileUrl,
      appLink: process.env.SERVER_ADDRESS,
      androidAppStoreLink: androidAppStoreLink,
      appleAppStoreLink: appleAppStoreLink,
      portalLink: process.env.SERVER_ADDRESS,
      data: data.data,
      content: data.content,
    };
  }

  private async renderTemplate(
    data: ejs.Data,
    template: OrganisationEmailTemplate,
  ) {
    // Merge the org template with the content data from the email template
    const lvl1 = await ejs.render(template.html, data, {
      async: true,
      escape: (x: string) => x,
    });

    // Now merge the rest of the possible ejs tags and make it HTML safe
    return await ejs.render(lvl1, data, { async: true });
  }
}
