import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ContractorDataReport } from 'src/trans-atlantic/contractor-data-report/contractor-data-report.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('kpis', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userAllPerms: UserFactoryReturn;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      isdeveloper: true
    })
      .create()

    let repo = app.get<Repository<ContractorDataReport>>(getRepositoryToken(ContractorDataReport))
    let orgContractorRepo = app.get<Repository<OrganisationContractor>>(getRepositoryToken(OrganisationContractor))
    try {

      await orgContractorRepo.save({
        owner: userAllPerms.user.id,
        organisation: userAllPerms.organisation.id,
        name: 'test'
      })


      await orgContractorRepo.save({
        owner: userAllPerms.user.id,
        organisation: userAllPerms.organisation.id,
        name: 'test2'
      })

      await repo.save({
        weeklyWorkedHours: 10,
        numOfWorkers: 10,
        numLostTimeInjuries: 10,
        numMajorInjuries: 10,
        numDangerousOccurences: 10,
        numNearMisses: 10,
        medicalTreatmentInjuries: 10,
        numRestrictedWorkCase: 10,
        numLostDays: 10,
        numRIDDOROccupationalIllnesses: 10,
        numRIDDOR7DayInjuries: 10,
        numRIDDOR3DayInjuries: 10,
        numEmployeeOver7DayInjuries: 10,
        numEmployeeOver3DayInjuries: 10,
        numOSHARecordableInjuriesIllnesses: 10,
        numTier1PSECount: 10,
        numTier2PSECount: 10,
        organisation: userAllPerms.organisation.id,
        owner: userAllPerms.user.id
      })
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    await down(app);
  })

  it('getTheKpis', async () => {
    let ret = await request(app.getHttpServer())
      .get(`/kpi`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null,
        startDate: new Date(),
        endDate: moment().subtract(1, 'year').toDate()
      })
      .expect(200)

      expect(ret)
  })

  it('getThekpiList', async () => {
    let ret = await request(app.getHttpServer())
      .get(`/kpi/list`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(ret)
  })
});
