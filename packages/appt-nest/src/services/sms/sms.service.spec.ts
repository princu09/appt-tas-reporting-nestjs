import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';

describe.skip('SmsService', () => {
  let service: SmsService;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env.TWILIO_ACCOUNT_SID = 'ACadf6f82be15ed9fbc68e396c8e80e1a0';
    process.env.TWILIO_AUTH_TOKEN = '74d855befbb00cd11263d3e0fd748bc1';
    process.env.TWILIO_MESSAGING_SID = 'MGa40de5812f015289dc5a67aa96c80d08';
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();
    module.useLogger(createMock<Logger>());
    service = module.get<SmsService>(SmsService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('SendMessage', () => {
    return expect(
      service.sendSMS({
        to: '+447484353311',
        body: `Hello, this is a test email from sms.service.spec.ts`,
      }),
    ).resolves.toBe(true);
  });
});
