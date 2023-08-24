import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { User } from 'src/auto-resources/user/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('organisation-contractor', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let user1: UserFactoryReturn;
  let user2: UserFactoryReturn;
  let userFactory: UserFactory;
  let userRepo: Repository<User>;

  let contractorRepo: Repository<OrganisationContractor>; 

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    userRepo = app.get<Repository<User>>(getRepositoryToken(User))

    contractorRepo = app.get<Repository<OrganisationContractor>>(getRepositoryToken(OrganisationContractor))

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
      isglobaladmin: true,
      isdeveloper: true
    })
      .create()

    user1 = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353312',
    })
    .setOrganisation(user.organisation)
      .create()

      user2 = await userFactory.addData({
        email: 'alex.taylor3@appt.digital',
        username: 'test3',
        mobile: '+447484353312',
      })
      .setOrganisation(user.organisation)
        .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('testAdding and removing users', async () => {

    const ret = await request(app.getHttpServer())
      .post(`/organisationcontractor`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        name: 'tester'
      })
      .expect(201)

    let org = ret.body as OrganisationContractor

    const ret2 = await request(app.getHttpServer())
    .post(`/organisationcontractor`)
    .set('Authorization', user.apiToken)
    .query({
      orgId: user.organisation.id,
      siteId: null
    })
    .send({
      name: 'tester2'
    })
    .expect(201)

  let org2 = ret2.body as OrganisationContractor

    let newContractUSer = await request(app.getHttpServer())
      .get(`/user/${user1.user.id}`)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .set('Authorization', user.apiToken)
      .expect(200)


    await request(app.getHttpServer())
      .post(`/organisationcontractor/assign/${org.id}`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({ userId: newContractUSer.body.id })
      .expect(201)

    let newOrg = await contractorRepo.findOne(org.id, { relations: ['users'] })
    expect(newOrg.users.length).toBe(1)

    await request(app.getHttpServer())
      .post(`/organisationcontractor/assign/${org.id}`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({ userId: user2.user.id })
      .expect(201)

    newOrg = await contractorRepo.findOne(org.id, { relations: ['users'] })
    expect(newOrg.users.length).toBe(2)

    // Assign different org make sure it un assigns the other one
    await request(app.getHttpServer())
      .post(`/organisationcontractor/assign/${org2.id}`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({ userId: user2.user.id })
      .expect(201)

    newOrg = await contractorRepo.findOne(org.id, { relations: ['users'] })
    expect(newOrg.users.length).toBe(1)
    newOrg = await contractorRepo.findOne(org2.id, { relations: ['users'] })
    expect(newOrg.users.length).toBe(1)

    // No access
    await request(app.getHttpServer())
    .post(`/organisationcontractor/assign/${org.id}`)
    .set('Authorization', user1.apiToken)
    .query({
      orgId: user.organisation.id,
      siteId: null
    })
    .send({ userId: user2.user.id })
    .expect(403)


    await request(app.getHttpServer())
    .post(`/organisationcontractor/assign/${org.id}`)
    .set('Authorization', user1.apiToken)
    .query({
      orgId: user.organisation.id,
      siteId: null
    })
    .send({ userId: user2.user.id })
    .expect(403)

  })
});
