import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { ApptLedgerService } from 'src/appt-ledger/appt-ledger.service';
import { User } from 'src/auto-resources/user/user.entity';
import { UserService } from 'src/auto-resources/user/user.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let service: StripeService;
  let stripeMock: DeepMocked<Stripe>;
  let userRepo: DeepMocked<Repository<User>>;
  let apptLedgerService: DeepMocked<ApptLedgerService>;
  let userService: DeepMocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ApptLedgerService,
          useValue: createMock<ApptLedgerService>(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
    stripeMock = createMock<Stripe>();
    StripeService.stripe = stripeMock;
    userRepo = module.get<DeepMocked<Repository<User>>>(
      getRepositoryToken(User),
    );
    userService = module.get<UserService>(
      UserService,
    ) as DeepMocked<UserService>;
    apptLedgerService = module.get<ApptLedgerService>(
      ApptLedgerService,
    ) as DeepMocked<ApptLedgerService>;
  });

  it('payUser', async () => {
    const user = new User();
    user.id = '12345';
    expect(await service.payUser(100.01, user, 'This is a test')).toBe(false);

    stripeMock.transfers.create = jest.fn().mockResolvedValue('hello test');
    user.stripeConnectAccountId = '1234';
    expect(await service.payUser(101.01, user, 'This is a test')).toBe(
      'hello test',
    );
    expect(stripeMock.transfers.create as jest.Mock).toBeCalledWith({
      amount: 101.01,
      currency: 'GBP',
      destination: '1234',
      description: 'This is a test',
    });
  });

  it('startPayment', async () => {
    const user = new User();
    user.id = '12345';

    const meta = {
      test: 1,
      test2: '2',
    };

    stripeMock.paymentIntents.create = jest.fn().mockResolvedValue('test');
    expect(
      await service.startPayment(
        101,
        user,
        meta,
        StripeService.PaymentType.APPT_LEDGER,
      ),
    ).toBe('test');
    expect(stripeMock.paymentIntents.create as jest.Mock).toBeCalledWith({
      amount: 101,
      currency: 'GBP',
      metadata: {
        paymentType: StripeService.PaymentType.APPT_LEDGER,
        user: '12345',
        ...meta,
      },
      payment_method_types: ['card'],
      setup_future_usage: 'on_session',
    });
  });

  it('createConnectedAccount', async () => {
    const user = new User();
    user.id = '12345';
    user.email = '12345@email.co.uk';

    stripeMock.accounts.create = jest
      .fn()
      .mockResolvedValue({ id: 'accountId' });
    expect(await service.createConnectedAccount(user)).toEqual({
      id: user.id,
      email: user.email,
      stripeConnectAccountId: 'accountId',
    });

    // Check this is called with the correct parameters
    expect(stripeMock.accounts.create as jest.Mock).toBeCalledWith({
      type: 'standard',
      country: 'GB',
      email: user.email,
    });

    // check the users `stripeConnectAccountId` is updated correctly
    expect(userRepo.save).toBeCalledWith({
      id: user.id,
      email: user.email,
      stripeConnectAccountId: 'accountId',
    });

    // Check we can't create another stripe connected account for a user
    // that already has one
    expect(await service.createConnectedAccount(user)).toEqual(false);
  });

  it('stripeWebhook', async () => {
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          metadata: {
            paymentType: StripeService.PaymentType.APPT_LEDGER,
          },
        },
      },
    };

    stripeMock.webhooks.constructEventAsync = jest.fn().mockReturnValue(event);

    const request = {};
    request['headers'] = {};
    request['headers']['stripe-signature'] = 'stripe-sig';
    request['body'] = {};
    service.handlePaymentMethod = jest.fn();

    expect(await service.stripeWebhook(request as Request));
    expect(apptLedgerService.handleLedgerPayment).toBeCalledWith({
      metadata: {
        paymentType: 0,
      },
    });
  });
  it('stripeWebhook-SSO', async () => {
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          metadata: {
            paymentType: StripeService.PaymentType.APPT_SELF_SIGN_UP,
          },
        },
      },
    };

    stripeMock.webhooks.constructEventAsync = jest.fn().mockReturnValue(event);

    const request = {};
    request['headers'] = {};
    request['headers']['stripe-signature'] = 'stripe-sig';
    request['body'] = {};
    service.handlePaymentMethod = jest.fn();

    expect(await service.stripeWebhook(request as Request));
    expect(userService.processSelfSignOnIntent).toBeCalledWith({
      metadata: {
        paymentType: 1,
      },
    });
  });
});
