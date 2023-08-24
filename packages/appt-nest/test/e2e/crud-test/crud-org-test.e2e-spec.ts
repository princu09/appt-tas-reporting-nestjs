import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Organisation } from '../../../src/auto-resources/organisation/organisation.entity';
import { down, up } from '../e2eHelpers';
import { UserFactory, UserFactoryReturn } from '../factories/user.factory';

describe('crudOrgTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userMyPerms: UserFactoryReturn;
  let userFactory: UserFactory;
  let organisation: Organisation;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [
          'GetMyOrg',
          'GetAllOrg',
          'DeleteMyOrg',
          'DeleteAllOrg',
          'UpdateMyOrg',
          'UpdateAllOrg',
          'CreateOrg',
          `OrganisationGetOne`,
          `OrganisationGetMany`,
          `OrganisationCreateOne`,
          `OrganisationCreateMany`,
          `OrganisationUpdateOne`,
          `OrganisationReplaceOne`,
          `OrganisationDeleteOne`,
          `OrganisationGetUsers`
        ]
      )
      .create()

    userMyPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        [
          'GetMyOrg',
          'DeleteMyOrg',
          'UpdateMyOrg',
          `OrganisationGetOne`,
          `OrganisationGetMany`,
          `OrganisationCreateOne`,
          `OrganisationCreateMany`,
          `OrganisationUpdateOne`,
          `OrganisationReplaceOne`,
          `OrganisationDeleteOne`
        ]
      )
      .create()

    const repo = app.get<Repository<Organisation>>(getRepositoryToken(Organisation))
    organisation = await repo.save({
      name: 'test'
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('GetAll', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/organisation`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret.body.length).toEqual(2)
  })
  it('GetMine', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/organisation`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null,
        s: `{"id": "${userAllPerms.organisation.id}"}`
      })
      .expect(200)
    expect(ret.body.length).toEqual(1)
    expect(ret.body[0].id).toEqual(userMyPerms.organisation.id)
  })
  it('GetUsers', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/organisation/${userAllPerms.organisation.id}/users`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret.body.users.length).toEqual(2)
    expect(ret.body.users.find(x => x.id= userMyPerms.user.id).id).toEqual(userMyPerms.user.id)
  })
  it('GetUsersNoPerm', async () => {
    await request(app.getHttpServer())
      .get(`/organisation/${userMyPerms.organisation.id}/users`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it('GetID', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/organisation/${organisation.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret.body.id).toEqual(organisation.id)
  })
  it('GetIDBad', () => {
    return request(app.getHttpServer())
      .get(`/organisation/${organisation.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })

  it('UpdateAllGood', async () => {
    const ret = await request(app.getHttpServer())
      .patch(`/organisation/${organisation.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        name: 'tester1'
      })
      .expect(200)
    expect(ret.body.name).toEqual('tester1')
  })
  it('UpdateMineGood', async () => {
    const ret = await request(app.getHttpServer())
      .patch(`/organisation/${userMyPerms.organisation.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .send({
        name: 'UpdateMineGood'
      })
      .expect(200)
    expect(ret.body.name).toEqual('UpdateMineGood')
  })
  it('UpdateAllBad', () => {
    return request(app.getHttpServer())
      .patch(`/organisation/${organisation.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .send({
        name: 'UpdateMineGood'
      })
      .expect(403)
  })

  it('DeleteBad', async () => {
    return request(app.getHttpServer())
      .delete(`/organisation/${organisation.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it('DeleteGood', () => {
    return request(app.getHttpServer())
      .delete(`/organisation/${organisation.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
  })
  it('DeleteGoodMine', () => {
    return request(app.getHttpServer())
      .delete(`/organisation/${userMyPerms.organisation.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: null
      })
      .expect(200)
  })
});
