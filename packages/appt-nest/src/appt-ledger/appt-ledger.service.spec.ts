import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApptLedgerService } from 'src/appt-ledger/appt-ledger.service';
import { User } from 'src/auto-resources/user/user.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { ApptLedger } from './appt-ledger.entity';

describe('ApptLedgerService', () => {
  let apptLedgerRepo: DeepMocked<Repository<ApptLedger>>;
  let service: ApptLedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApptLedgerService,
        {
          provide: getRepositoryToken(ApptLedger),
          useValue: createMock<Repository<ApptLedger>>(),
        },
      ],
    }).compile();

    module.useLogger(createMock<Logger>());

    service = module.get<ApptLedgerService>(ApptLedgerService);
    apptLedgerRepo = module.get<DeepMocked<Repository<ApptLedger>>>(
      getRepositoryToken(ApptLedger),
    );

    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  it('HandlePayment', async () => {
    const user = new User();
    user.id = '12345';

    const ledger = new ApptLedger();
    apptLedgerRepo.findOne.mockResolvedValue(ledger);

    await service.handleLedgerPayment({
      id: 'stripeIntentId',
      metadata: {
        apptLedgerId: '123456',
      },
    } as any as Stripe.PaymentIntent);

    expect(apptLedgerRepo.save).toBeCalledWith({
      stripeIntentID: 'stripeIntentId',
      receivedAt: new Date(),
    });
  });

  it('HandlePaymentBadLedgerID', async () => {
    const user = new User();
    user.id = '12345';

    apptLedgerRepo.findOne.mockResolvedValue(null);

    await service.handleLedgerPayment({
      id: 'stripeIntentId',
      metadata: {
        apptLedgerId: '123456',
      },
    } as any as Stripe.PaymentIntent);

    expect(apptLedgerRepo.save).not.toBeCalled();
  });

  it('HandlePaymentAlreadySubmitted', async () => {
    const user = new User();
    user.id = '12345';

    const ledger = new ApptLedger();
    ledger.stripeIntentID = '12341234';
    apptLedgerRepo.findOne.mockResolvedValue(ledger);

    await service.handleLedgerPayment({
      id: 'stripeIntentId',
      metadata: {
        apptLedgerId: '123456',
      },
    } as any as Stripe.PaymentIntent);

    expect(apptLedgerRepo.save).not.toBeCalled();
  });

  it('HandlePaymentNoMeta', async () => {
    const user = new User();
    user.id = '12345';

    const ledger = new ApptLedger();
    apptLedgerRepo.findOne.mockResolvedValue(ledger);

    await service.handleLedgerPayment({
      id: 'stripeIntentId',
      metadata: {},
    } as any as Stripe.PaymentIntent);

    expect(apptLedgerRepo.save).not.toBeCalled();
  });
});
