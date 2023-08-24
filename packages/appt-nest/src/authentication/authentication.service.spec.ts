import { createMock } from '@golevelup/ts-jest';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailTemplateTriggerService } from 'src/auto-resources/email-template/email-template-trigger/email-template-trigger.service';
import { RecordService } from 'src/auto-resources/record/record.service';
import { Siteadmin } from 'src/auto-resources/site-admin/site-admin.entity';
import { Siteuser } from 'src/auto-resources/site-user/site-user.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { Repository } from 'typeorm';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { Site } from '../auto-resources/site/site.entity';
import { LocalsService } from '../services/locals/locals.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let locals: LocalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        LocalsService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Organisation),
          useValue: createMock<Repository<Organisation>>(),
        },
        {
          provide: getRepositoryToken(Site),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Siteuser),
          useValue: createMock<Repository<Siteuser>>(),
        },
        {
          provide: getRepositoryToken(Siteadmin),
          useValue: createMock<Repository<Siteadmin>>(),
        },
        {
          provide: RecordService,
          useValue: createMock<RecordService>(),
        },
        {
          provide: EmailTemplateTriggerService,
          useValue: createMock<EmailTemplateTriggerService>(),
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    locals = module.get<LocalsService>(LocalsService);
    module.useLogger(createMock<Logger>());

    locals.getUserId = jest.fn().mockReturnValue('1');
    locals.getOrganisation = jest
      .fn()
      .mockReturnValue({ id: '2' } as Organisation);
    locals.getSite = jest.fn().mockReturnValue({ id: '3' } as Site);
  });

  it('tokenTest', () => {
    process.env.JWT_SECRET = '123123';
    process.env.JWT_EXP = '1hr';
    const token = service.generateToken('1');
    const payload = service.validateToken(token);
    expect(payload.userId).toEqual('1');
  });

  it('tokenTestBad', () => {
    process.env.JWT_SECRET = '123123';
    process.env.JWT_EXP = '1hr';
    const token = 'jdiasjidjasjidjas';
    const test = () => {
      service.validateToken(token);
    };
    expect(test).toThrow(UnauthorizedException);
  });
});
