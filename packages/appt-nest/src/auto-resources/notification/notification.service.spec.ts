import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientResponse } from '@sendgrid/mail';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { EmailService } from 'src/services/email/email.service';
import { PushService } from 'src/services/push/push.service';
import { SmsService } from 'src/services/sms/sms.service';
import { Repository } from 'typeorm';
import { OrganisationEmailTemplate } from '../organisation-email-template/organisation-email-template.entity';
import { UserDeviceToken } from '../user-device-token/user-device-token.entity';
import { UserDeviceTokenService } from '../user-device-token/user-device-token.service';
import { User } from '../user/user.entity';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from './notification.entity';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  const OLD_ENV = process.env;
  let service: NotificationService;
  let smsService: DeepMocked<SmsService>;
  let emailService: DeepMocked<EmailService>;
  let notificationRepo: DeepMocked<Repository<Notification>>;
  let deviceRepo: DeepMocked<Repository<UserDeviceToken>>;
  let pushService: DeepMocked<PushService>;
  beforeEach(async () => {
    notificationRepo = createMock<Repository<Notification>>();
    deviceRepo = createMock<Repository<UserDeviceToken>>();

    let tmp = notificationRepo as any;
    tmp['metadata'] = {
      connection: { options: { type: null } },
      columns: [],
      relations: [],
    };
    tmp['manager'] = { transaction: (a) => Promise.resolve(a()) };

    tmp = deviceRepo as any;
    tmp['metadata'] = {
      connection: { options: { type: null } },
      columns: [],
      relations: [],
    };
    tmp['manager'] = { transaction: (a) => Promise.resolve(a()) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationRepo,
        },
        {
          provide: UserDeviceTokenService,
          useValue: deviceRepo,
        },
        {
          provide: EmailService,
          useValue: createMock<EmailService>(),
        },
        {
          provide: SmsService,
          useValue: createMock<SmsService>(),
        },
        {
          provide: PushService,
          useValue: createMock<PushService>(),
        },
      ],
    }).compile();
    module.useLogger(createMock<Logger>());
    service = module.get<NotificationService>(NotificationService);
    notificationRepo = module.get(getRepositoryToken(Notification));
    smsService = module.get(SmsService);
    emailService = module.get(EmailService);
    pushService = module.get(PushService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('SendSMS', async () => {
    const notification = new Notification();
    notification.type = NotificationType.sms;
    notification.body = 'body';
    notification.from = 'from';
    notification.targetUser = new User();
    notification.targetUser.mobile = 'MobileNumber';

    await service.sendNotification(notification);

    smsService.sendSMS.mockResolvedValue(true);

    expect(smsService.sendSMS).toBeCalledWith({
      body: 'body',
      from: 'from',
      to: 'MobileNumber',
    });

    notification.status = NotificationStatus.sent;

    expect(notificationRepo.save).toBeCalledWith(notification);
  });

  it('SendSMSBad', async () => {
    const notification = new Notification();
    notification.type = NotificationType.sms;
    notification.body = null;
    notification.from = 'from';
    notification.targetUser = new User();
    notification.targetUser.mobile = 'MobileNumber';

    await service.sendNotification(notification);

    smsService.sendSMS.mockResolvedValue(true);

    expect(smsService.sendSMS).not.toBeCalled();

    notification.status = NotificationStatus.failed;

    expect(notificationRepo.save).toBeCalledWith(notification);
  });

  it('SendEmail', async () => {
    const notification = new Notification();
    notification.type = NotificationType.email;
    notification.body = 'body';
    notification.from = 'from';
    notification.targetUser = new User();
    notification.targetUser.email = 'testEmail';
    notification.subject = 'subject';
    notification.template = new OrganisationEmailTemplate();
    notification.data = { test: 'test' };
    notification.organisationModel = null;

    await service.sendNotification(notification);

    const ret = {
      statusCode: 202,
    } as ClientResponse;
    emailService.sendOrganisationEmail.mockResolvedValue([ret, {}]);

    expect(emailService.sendOrganisationEmail).toBeCalledWith(null, {
      to: notification.targetUser.email,
      from: notification.from,
      subject: notification.subject,
      content: notification.body,
      title: notification.subject,
      attachments: [],
      template: notification.template,
      data: notification.data,
    });

    notification.status = NotificationStatus.sent;

    expect(notificationRepo.save).toBeCalledWith(notification);
  });

  it('SendPush', async () => {
    const notification = new Notification();
    notification.type = NotificationType.push;
    notification.body = 'body';
    notification.from = 'from';
    notification.targetUser = new User();
    notification.targetUser.email = 'testEmail';
    notification.subject = 'subject';
    notification.template = new OrganisationEmailTemplate();
    notification.data = { test: 'test' };
    notification.organisationModel = null;

    await service.sendNotification(notification);

    pushService.sendNotification.mockResolvedValue([
      { successCount: 1 },
    ] as BatchResponse[]);

    deviceRepo.find.mockResolvedValue([
      { deviceToken: '123' },
      { deviceToken: '1234' },
    ] as UserDeviceToken[]);

    expect(pushService.sendNotification).toBeCalledWith(
      ['123', '1234'],
      notification.data,
      {
        title: notification.subject,
        body: notification.body,
      },
    );

    notification.status = NotificationStatus.sent;
    expect(notificationRepo.save).toBeCalledWith(notification);
  });
});
