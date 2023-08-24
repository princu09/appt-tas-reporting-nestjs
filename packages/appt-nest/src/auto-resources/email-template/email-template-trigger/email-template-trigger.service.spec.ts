import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { AwsService } from 'src/services/aws/aws.service';
import { EmailService } from 'src/services/email/email.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { MockType } from 'test/helpers/mockType';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EmailTemplate } from '../email-template.entity';
import { EmailTemplateTriggerDelayed } from './email-template-delayed.entity';
import { EmailTemplateTriggerService } from './email-template-trigger.service';
import { EmailTrigger } from './email-template-triggers';

describe.skip('EmailTriggerService', () => {
  const OLD_ENV = process.env;
  let emailService: EmailService;
  let emailTemplateRepo: MockType<Repository<EmailTemplate>>;
  let service: EmailTemplateTriggerService;
  const mock = jest.fn(() => 1639145702008);

  beforeEach(async () => {
    jest.resetModules();
    process.env.SENDGRID_KEY =
      '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';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTemplateTriggerService,
        {
          provide: EmailService,
          useValue: createMock<EmailService>(),
        },
        {
          provide: AwsService,
          useValue: createMock<AwsService>(),
        },
        {
          provide: LocalsService,
          useValue: createMock<LocalsService>(),
        },
        {
          provide: getRepositoryToken(EmailTemplate),
          useValue: createMock<Repository<EmailTemplate>>(),
        },
        {
          provide: getRepositoryToken(EmailTemplateTriggerDelayed),
          useValue: createMock<Repository<EmailTemplateTriggerDelayed>>(),
        },
      ],
    }).compile();

    module.useLogger(createMock<Logger>());
    service = module.get<EmailTemplateTriggerService>(
      EmailTemplateTriggerService,
    );
    emailService = module.get<EmailService>(EmailService);
    emailTemplateRepo = module.get<MockType<Repository<EmailTemplate>>>(
      getRepositoryToken(EmailTemplate),
    );
    Date.now = mock;
  });

  afterAll(() => {
    process.env = OLD_ENV;
    mock.mockClear();
  });

  it('TestTriggerEmail', async () => {
    const template = new OrganisationEmailTemplate();
    template.html = `<%= content %><%= data.firstname %>`;

    const templateRepoRet = {
      fromAddress: 'from@test',
      subject: 'Test Trigger Immediate Send',
      template: template,
      CC: 'CC',
      BCC: 'BCC',
      content: '<h1>A h1 title <%= data.firstname %> </h1>',
      triggers: [EmailTrigger.new_user_invite],
      attachments: [],
      title: undefined,
    };

    const qb = createMock<SelectQueryBuilder<EmailTemplate>>();
    qb.where.mockReturnThis();
    qb.getMany.mockResolvedValue([templateRepoRet] as EmailTemplate[]);

    emailTemplateRepo.createQueryBuilder.mockReturnValue(qb);

    await service.triggerEmail(null, [EmailTrigger.new_user_invite], {
      firstname: 'alex',
      lastname: 'taylor',
      mobile: '07777777777',
      email: 'alex.taylor@appt.digital',
    });

    expect(emailService.sendOrganisationEmail).toBeCalledWith(
      {},
      {
        to: 'alex.taylor@appt.digital',
        from: 'from@test',
        subject: 'Test Trigger Immediate Send',
        content: '<h1>A h1 title <%= data.firstname %> </h1>',
        data: {
          email: 'alex.taylor@appt.digital',
          firstname: 'alex',
          lastname: 'taylor',
          mobile: '07777777777',
        },
        template: {
          html: '<%= content %><%= data.firstname %>',
        },
        title: undefined,
        attachments: [],
      },
    );
  });
});
