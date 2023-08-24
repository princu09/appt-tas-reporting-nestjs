import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ApptLedgerService } from 'src/appt-ledger/appt-ledger.service';
import { User } from 'src/auto-resources/user/user.entity';
import { UserService } from 'src/auto-resources/user/user.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

enum paymentTypes {
  APPT_LEDGER = 0,
  APPT_SELF_SIGN_UP = 1,
}

export type StripeMetaData = {
  user: string;
  paymentType: paymentTypes;
};

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly currency = 'GBP';

  static readonly PaymentType = paymentTypes;
  static stripe: Stripe;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly apptLedgerService: ApptLedgerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    if (process.env.NODE_ENV !== 'test') {
      StripeService.stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: '2020-08-27',
      });
    }
  }

  async payUser(amount: number, user: User, description = '') {
    if (!user?.stripeConnectAccountId) return false;

    try {
      // Create the stripe transfer
      const transfer = await StripeService.stripe.transfers.create({
        amount: amount,
        currency: this.currency,
        destination: user.stripeConnectAccountId,
        description: description,
      });
      return transfer;
    } catch (err) {
      this.logger.error(
        `payUser: Failed to create transfer: Parameters(${amount}, userID ${
          user.id
        }, ${description}) error:(${JSON.stringify(err)})`,
      );
      return false;
    }
  }

  async createConnectedAccount(user: User) {
    try {
      // Don't create stripe account twice
      if (user?.stripeConnectAccountId) return false;

      // Create the connected account
      const account = await StripeService.stripe.accounts.create({
        type: 'standard',
        country: 'GB',
        email: user.email,
      });

      // Link up the ids
      user.stripeConnectAccountId = account.id;

      await this.userRepo.save(user);

      return user;
    } catch (err) {
      this.logger.error(
        `createConnectedAccount failed to create stripe connect account for user ${
          user.id
        } error: ${JSON.stringify(err)}`,
      );
      return false;
    }
  }

  async stripeWebhook(request: Request) {
    let event = request.body;

    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = await StripeService.stripe.webhooks.constructEventAsync(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      this.logger.log(
        `stripeWebhook: Webhook signature verification failed. ${err.message}`,
      );
      throw new BadRequestException();
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handleSucceeded(paymentIntent);
        break;
      }
      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await this.handlePaymentMethod(paymentMethod);
        break;
      }
      default:
        // Unexpected event type
        this.logger.log(`stripeWebhook: Unhandled event type ${event.type}.`);
    }
  }

  // eslint-disable-next-line
  async handlePaymentMethod(paymentMethod: Stripe.PaymentMethod) {
    // For now we don't need to do anything...
    // When creating and intent we use this `setup_future_usage` which should do this automatically.
  }

  async handleSucceeded(intent: Stripe.PaymentIntent) {
    const metadata = intent.metadata as Partial<StripeMetaData>;
    switch (metadata.paymentType) {
      case StripeService.PaymentType.APPT_LEDGER: {
        await this.apptLedgerService.handleLedgerPayment(intent);
        break;
      }
      case StripeService.PaymentType.APPT_SELF_SIGN_UP: {
        await this.userService.processSelfSignOnIntent(intent);
        break;
      }
      default:
        this.logger.log(
          `handleSucceeded:: Unknown payment type ${metadata.paymentType}`,
        );
    }
  }

  async startPayment(
    amount: number,
    user: User,
    metadata: Stripe.MetadataParam,
    type: paymentTypes,
  ) {
    return await StripeService.stripe.paymentIntents.create({
      amount: amount,
      currency: this.currency,
      payment_method_types: ['card'],
      metadata: {
        paymentType: type,
        user: user.id,
        ...metadata,
      },
      setup_future_usage: 'on_session',
    });
  }
}
