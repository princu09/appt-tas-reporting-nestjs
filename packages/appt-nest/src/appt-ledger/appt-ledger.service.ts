import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { OrganisationCharge } from 'src/auto-resources/organisation-charge/organisation-charge.entity';
import { OrganisationUserPurchases } from 'src/auto-resources/organisation-user-purchases/organisation-user-purchases.entity';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { StripeMetaData } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { Between, getConnection, Repository } from 'typeorm';
import { ApptLedger } from './appt-ledger.entity';

type ApptLedgerStripeMetadata = StripeMetaData & {
  apptLedgerId: number | null;
};

@Injectable()
export class ApptLedgerService {
  private readonly logger = new Logger(ApptLedgerService.name);

  constructor(
    @InjectRepository(ApptLedger) private apptRepo: Repository<ApptLedger>,
  ) {}

  get(org: Organisation, start: string | null, end: string | null) {
    let startDate = start ? moment(start) : moment().subtract(30, 'days');
    if (!startDate.isValid()) startDate = moment().subtract(30, 'days');

    let endDate = end ? moment(end) : moment();
    if (!endDate.isValid()) endDate = moment();

    if (startDate > endDate) {
      const tmp = startDate;
      startDate = endDate;
      endDate = tmp;
    }

    return this.apptRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
        organisationModel: org,
      },
    });
  }

  async handleLedgerPayment(intent: Stripe.PaymentIntent) {
    // Get the correct type information
    const metadata = intent.metadata as any as ApptLedgerStripeMetadata;

    // We need this or there is nothing we can do with it
    if (!metadata.apptLedgerId) {
      this.logger.error(
        `Intent with id ${
          intent.id
        } has the incorrect meta data ${JSON.stringify(metadata)}`,
      );
      return;
    }

    // Does this exist ?
    const ledger = await this.apptRepo.findOne(metadata.apptLedgerId);
    if (!ledger) {
      this.logger.error(
        `Intent id has an incorrect ledger id tag: apptLedgerId = (${metadata.apptLedgerId})`,
      );
      return;
    }

    // Stripe can send multiple requests for the same intent
    if (!ledger.stripeIntentID) {
      ledger.stripeIntentID = intent.id;
      ledger.receivedAt = new Date();
      await this.apptRepo.save(ledger);
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    name: 'ApptLedgerCalculations',
  })
  async updateLedger() {
    await getConnection().transaction(async (transactionalEntityManager) => {
      // Calculate what each oranisation owes
      const ledgeCalculate = await transactionalEntityManager.query(`
				SELECT
					"org"."id" AS "organisation",
					COALESCE(SUM("apl"."owed"), 0.0) + 
					COALESCE(SUM("orgContract"."contractcost"), 0.0) + 
					COALESCE(SUM("orgCharge"."chargecost"), 0.0) - 
					COALESCE(SUM("orgUserPurchase"."userpurchasecost"), 0.0) AS cost
				FROM
					"organisation" "org"
					LEFT JOIN (
						SELECT
						COALESCE(SUM("oc"."cost"), 0.0) AS chargecost,
							"oc"."organisation" AS id
						FROM
							"organisationcharge" "oc"
						WHERE ("oc"."processed" = FALSE)
						AND("oc"."deletedAt" IS NULL)
					GROUP BY
						"oc"."organisation") "orgCharge" ON "orgCharge"."id" = "org"."id"
					LEFT JOIN (
						SELECT
						  COALESCE(SUM("con"."cost"), 0.0) AS contractcost,
							"con"."organisation" AS id
						FROM
							"organisationcontract" "con"
						WHERE
							"con"."deletedAt" IS NULL
						GROUP BY
							"con"."organisation") "orgContract" ON "orgContract"."id" = "org"."id"
					LEFT JOIN (
						SELECT
						  COALESCE(SUM("oup"."cost"), 0.0) AS userpurchasecost,
							"oup"."organisation" AS id
						FROM
							"organisationuserpurchases" "oup"
						WHERE ("oup"."processed" = FALSE
							AND "oup"."received" = TRUE)
						GROUP BY
							"oup"."organisation") "orgUserPurchase" ON "orgUserPurchase"."id" = "org"."id"
					LEFT JOIN (
						SELECT
						  COALESCE(SUM("apl"."cost"), 0.0) AS owed,
							"apl"."organisation" AS id
						FROM
							"apptledger" "apl"
						WHERE
							"apl"."outstanding" = TRUE
							AND "apl"."rolledover" = FALSE
						GROUP BY
							"apl"."organisation") "apl" ON "apl"."id" = "org"."id"
				GROUP BY
					"org"."id"
			`);

      // Update old ledger inputs to rolled over and not oustanding
      await transactionalEntityManager
        .createQueryBuilder()
        .update(ApptLedger)
        .set({
          rolledover: true,
          outstanding: false,
        })
        .execute();

      // Create the new apptledger values as not rolled over and outstanding
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(ApptLedger)
        .values(ledgeCalculate)
        .execute();

      // Set all of the organisation charges to processed
      await transactionalEntityManager
        .createQueryBuilder()
        .update(OrganisationCharge)
        .set({
          processed: true,
        })
        .execute();

      // Set all of the organisations user purchases that we have received to processed
      await transactionalEntityManager
        .createQueryBuilder()
        .update(OrganisationUserPurchases)
        .set({
          processed: true,
        })
        .where('received = true')
        .execute();
    });
  }
}
