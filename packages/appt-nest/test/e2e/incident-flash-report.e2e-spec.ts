import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('IncidentFlashReport', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userFactory: UserFactory;
  let orgTemplateRepo: Repository<OrganisationEmailTemplate>

  jest.setTimeout(3000000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
      isdeveloper: true
    })
      .create()

    orgTemplateRepo = app.get(getRepositoryToken(OrganisationEmailTemplate))
    
    var ocRepo = app.get(getRepositoryToken(OrganisationContractor))
    await ocRepo.save({ 
      default: true,
      name: user.organisation.name,
      organisation: user.organisation.id,
      owner: user.user.id
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('check contractor id', async () => {
    let { body } = await request(app.getHttpServer())
      .post(`/incident-flash-report`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
      })
      .expect(201)

    expect(body.contractorId).not.toBeFalsy()
    {
      let { body } = await request(app.getHttpServer())
        .get(`/incident-flash-report`)
        .set('Authorization', user.apiToken)
        .query({
          orgId: user.organisation.id,
          siteId: null
        })
        .expect(200)

      expect(body[0]?.contractor?.name).toBe(user.organisation.name)
    }
  })

});