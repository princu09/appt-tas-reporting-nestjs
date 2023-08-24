import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApptLedger } from 'src/appt-ledger/appt-ledger.entity';
import { ApptLedgerService } from 'src/appt-ledger/appt-ledger.service';
import { OrganisationCharge } from 'src/auto-resources/organisation-charge/organisation-charge.entity';
import { OrganisationContract } from 'src/auto-resources/organisation-contract/organisation-contract.entity';
import { OrganisationProduct } from 'src/auto-resources/organisation-product/organisation-product.entity';
import { OrganisationUserPurchases } from 'src/auto-resources/organisation-user-purchases/organisation-user-purchases.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('appt-ledger', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let user1: UserFactoryReturn;
  let userFactory: UserFactory;
  let userRepo: Repository<User>;
  let ledgerService: ApptLedgerService;

  let contractRepo: Repository<OrganisationContract>; 
  let chargeRepo: Repository<OrganisationCharge>; 
  let userPurchaseRepo: Repository<OrganisationUserPurchases>; 
  let ledgerRepo: Repository<ApptLedger>; 
  let productRepo: Repository<OrganisationProduct>; 

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    userRepo = app.get<Repository<User>>(getRepositoryToken(User))

    contractRepo = app.get<Repository<OrganisationContract>>(getRepositoryToken(OrganisationContract))
    chargeRepo = app.get<Repository<OrganisationCharge>>(getRepositoryToken(OrganisationCharge))
    userPurchaseRepo = app.get<Repository<OrganisationUserPurchases>>(getRepositoryToken(OrganisationUserPurchases))
    ledgerRepo = app.get<Repository<ApptLedger>>(getRepositoryToken(ApptLedger))
    productRepo = app.get<Repository<OrganisationProduct>>(getRepositoryToken(OrganisationProduct))

    ledgerService = app.get<ApptLedgerService>(ApptLedgerService)

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .create()

    user1 = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353312',
    })
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('test', async () => {
    let product = await productRepo.save({
      cost: 123,
      organisationModel: user.organisation,
      ownerModel: user.user
    })

    await contractRepo.save([
      {
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 100.01
      },
      { // Should not be processed
        organisationModel: user.organisation,
        cost: 100.01,
        ownerModel: user.user,
        deletedAt: Date()
      },
      { // Test Multi
        organisationModel: user1.organisation,
        cost: 100.00,
        ownerModel: user.user,
      },
      {
        organisationModel: user1.organisation,
        cost: 100.00,
        ownerModel: user.user,
      }
    ])

    await chargeRepo.save([
      {
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 20.00
      },
      {
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 20.00
      },
      {
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 20.00
      },
      {
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 20.00
      },
      { // Test deleted should not be processed
        organisationModel: user.organisation,
        ownerModel: user.user,
        cost: 20.00,
        deletedAt: Date()
      },
      {
        organisationModel: user1.organisation,
        ownerModel: user.user, // Doesnt matter who owns it
        cost: 10.00123 // this will be in the DB as 10.00 as we only save a precision of 2
      },
      {
        organisationModel: user1.organisation,
        ownerModel: user.user,
        cost: 10.00
      },
    ])

    await userPurchaseRepo.save([{
      organisationModel: user.organisation,
      cost: 20.00,
      ownerModel: user.user,
      product: product,
      received: true
    },
    { // Not received dont process
      organisationModel: user.organisation,
      cost: 20.00,
      ownerModel: user.user,
      product: product,
      received: false
    },
    { // Still process even if deleted
      organisationModel: user.organisation,
      cost: 20.00,
      ownerModel: user.user,
      product: product,
      received: true,
      deletedAt: Date()
    },
  
    { // Still process even if deleted
      organisationModel: user1.organisation,
      cost: 21.00,
      ownerModel: user.user,
      product: product,
      received: true,
      deletedAt: Date()
    }])

    await ledgerService.updateLedger()

    const ledger = await ledgerRepo.findOne({
      organisationModel: user.organisation
    })

    expect(ledger.cost).toBe('140.01')
    expect(ledger.outstanding).toBe(true)
    expect(ledger.rolledover).toBe(false)

    const ledger2 = await ledgerRepo.findOne({
      organisationModel: user1.organisation
    })

    expect(ledger2.cost).toBe('199.00')
    expect(ledger2.outstanding).toBe(true)
    expect(ledger2.rolledover).toBe(false)

    // Check the ledger has created 2 lines for the current orgs
    expect((await ledgerRepo.find({
      outstanding: true,
      rolledover: false
    })).length).toBe(2)

    // Org 2 pays there balance
    ledger2.outstanding = false
    await ledgerRepo.save(ledger2)

    await ledgerService.updateLedger()

    const ledger1 = await ledgerRepo.findOne({
      organisationModel: user.organisation,
      rolledover: false
    })
    // Test that all charges/user purchases we have received are set to processed
    // The only addition should be the users contract amount
    expect(ledger1.cost).toBe('240.02')
    expect(ledger1.outstanding).toBe(true)
    expect(ledger1.rolledover).toBe(false)

    // Ledger payed for org 2
    const ledger4 = await ledgerRepo.findOne({
      organisationModel: user1.organisation,
      rolledover: false
    })

    expect(ledger4.cost).toBe('200.00')
    expect(ledger4.outstanding).toBe(true)
    expect(ledger4.rolledover).toBe(false)

    // Check the ledger has created 2 for the current orgs
    expect((await ledgerRepo.find({
      outstanding: false,
      rolledover: true
    })).length).toBe(2)

    // Expect there to be 2 rolled over ledgers lines
    expect((await ledgerRepo.find({
      outstanding: true,
      rolledover: false
    })).length).toBe(2)
  })
});
