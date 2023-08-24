import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { EmailService } from 'src/services/email/email.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { StripeService } from 'src/stripe/stripe.service';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { EmailTemplateTriggerService } from '../email-template/email-template-trigger/email-template-trigger.service';
import { OrganisationService } from '../organisation/organisation.service';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { Siteuser } from '../site-user/site-user.entity';
import { Site } from '../site/site.entity';
import { User, UserDTO } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  const OLD_ENV = process.env;
  let service: UserService;
  let stripeService: DeepMocked<StripeService>;
  let emailTemplateTrigger: DeepMocked<EmailTemplateTriggerService>;
  let authService: DeepMocked<AuthenticationService>;
  let userRepo: DeepMocked<Repository<User>>;
  const locals = new LocalsService();
  beforeEach(async () => {
    userRepo = createMock<Repository<User>>();
    const tmp = userRepo as any;
    tmp['metadata'] = {
      connection: { options: { type: null } },
      columns: [],
      relations: [],
    };
    tmp['manager'] = { transaction: (a) => Promise.resolve(a()) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
        {
          provide: getRepositoryToken(Organisation),
          useValue: createMock<Repository<Organisation>>(),
        },
        {
          provide: getRepositoryToken(Siteuser),
          useValue: createMock<Repository<Siteuser>>(),
        },
        {
          provide: getRepositoryToken(OrganisationContractor),
          useValue: createMock<Repository<OrganisationContractor>>(),
        },
        {
          provide: getRepositoryToken(Site),
          useValue: createMock<Repository<Site>>(),
        },
        {
          provide: getRepositoryToken(Role),
          useValue: createMock<Repository<Role>>(),
        },
        {
          provide: EmailService,
          useValue: createMock<EmailService>(),
        },
        {
          provide: RoleService,
          useValue: createMock<RoleService>(),
        },
        {
          provide: LocalsService,
          useValue: createMock<LocalsService>(),
        },
        {
          provide: AuthenticationService,
          useValue: createMock<AuthenticationService>(),
        },
        {
          provide: StripeService,
          useValue: createMock<StripeService>(),
        },
        {
          provide: EmailTemplateTriggerService,
          useValue: createMock<EmailTemplateTriggerService>(),
        },
        {
          provide: OrganisationService,
          useValue: createMock<OrganisationService>(),
        },
      ],
    }).compile();
    module.useLogger(createMock<Logger>());
    service = module.get<UserService>(UserService);
    stripeService = module.get<StripeService>(
      StripeService,
    ) as DeepMocked<StripeService>;
    emailTemplateTrigger = module.get<EmailTemplateTriggerService>(
      EmailTemplateTriggerService,
    ) as DeepMocked<EmailTemplateTriggerService>;
    authService = module.get<AuthenticationService>(
      AuthenticationService,
    ) as DeepMocked<AuthenticationService>;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Invite', async () => {
    const user = new User();
    const org = new Organisation();
    locals.getOrganisation = jest.fn().mockReturnValue(org);

    service.createUserWithOrgSite = jest.fn().mockResolvedValue(user);
    await service.invite(null, new UserDTO());

    expect(emailTemplateTrigger.triggerOrganisationEmail).toBeCalled();
  });

  it('SSO', async () => {
    const user = new User();
    authService.generatePassword.mockResolvedValue('12345');
    userRepo.save.mockResolvedValue(user);
    userRepo.count.mockResolvedValue(0);
    stripeService.startPayment.mockResolvedValue({
      client_secret: 'secret',
    } as any as Stripe.Response<Stripe.PaymentIntent>);

    expect(
      await service.startSelfSignOn({
        username: '1234',
        email: 'alex.taylor@appt.digital',
        password: '100%Safe',
      }),
    ).toStrictEqual({ secret: 'secret' });
    expect(userRepo.save).toBeCalledWith({
      password: '12345',
      username: '1234',
      email: 'alex.taylor@appt.digital',
    });
    expect(stripeService.createConnectedAccount).toBeCalledWith(user);
    expect(stripeService.startPayment).toBeCalledWith(
      100,
      user,
      {
        selfSignUp: user.id,
      },
      StripeService.PaymentType.APPT_SELF_SIGN_UP,
    );
  });
  it('SSO duplcate', async () => {
    userRepo.count.mockResolvedValue(1);
    await expect(async () => {
      await service.startSelfSignOn({
        username: '1234',
        email: 'alex.taylor@appt.digital',
        password: '100%Safe',
      });
    }).rejects.toThrow(
      new BadRequestException(`Username or Email already in use.`),
    );
  });
});
