import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { LocalsService } from '../locals/locals.service';
import { EmailService } from './email.service';

describe.skip('EmailService', () => {
  const OLD_ENV = process.env;
  let service: EmailService;
  const locals = new LocalsService();
  beforeEach(async () => {
    jest.resetModules();
    process.env.SENDGRID_KEY =
      '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';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: LocalsService,
          useValue: locals,
        },
      ],
    }).compile();

    process.env.SERVER_ADDRESS = 'https://bbc.co.uk';
    const organisation = new Organisation();
    organisation.primarycolour = '#FF0000';
    organisation.androidappstorelink = 'Android';
    organisation.appleappstorelink = 'Apple';
    organisation.logo.fileUrl =
      'https://www.google.com/logos/doodles/2021/st-andrews-day-2021-6753651837109150-l.png';
    locals.getOrganisation = jest.fn().mockReturnValue(organisation);
    module.useLogger(createMock<Logger>());
    service = module.get<EmailService>(EmailService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('sendEmail', async () => {
    const ret = await service.sendMail({
      to: 'alex.taylor@appt.digital',
      from: 'alex.taylor@appt.digital',
      subject: 'This the nestJS test',
      text: 'Hello World!',
      html: '<h1>Hello World!</h1>',
      attachments: [],
    });

    expect(ret.length).toEqual(2);
    expect(ret[0].statusCode).toEqual(202);
  });

  it('sendOrgEmail', async () => {
    const oet = new OrganisationEmailTemplate();
    oet.html = '<%- content  %>';
    await service.sendOrganisationEmail(new Organisation(), {
      template: oet,
      to: 'alex.taylor@appt.digital',
      from: 'alex.taylor@appt.digital',
      subject: 'Test email sendOrgEmail',
      content: 'Hello World! 😀 😃 😄 😁',
      title: 'test',
      data: [],
      attachments: [],
    });
  });
});
