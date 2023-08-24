import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { exit } from 'process';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Site } from '../../../src/auto-resources/site/site.entity';
import { down, up } from '../e2eHelpers';
import { SiteFactory } from '../factories/site.factory';
import { UserFactory, UserFactoryReturn } from '../factories/user.factory';

describe('crudSiteTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userMyPerms: UserFactoryReturn;
  let userFactory: UserFactory;
  let siteFactory: SiteFactory;

  let site: Site;
  let site1: Site;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory, siteFactory} = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [
          'GetMysite',
          'GetAllsite',
          'DeleteMysite',
          'DeleteAllsite',
          'UpdateMysite',
          'UpdateAllsite',
          'ReplaceMysite',
          'ReplaceAllsite',
          'Createsite',
          `SiteGetOne`,
          `SiteGetMany`,
          `SiteCreateOne`,
          `SiteCreateMany`,
          `SiteUpdateOne`,
          `SiteReplaceOne`,
          `SiteDeleteOne`
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
          'GetMysite',
          'DeleteMysite',
          'UpdateMysite',
          'ReplaceMysite',
          `SiteGetOne`,
          `SiteGetMany`,
          `SiteCreateOne`,
          `SiteCreateMany`,
          `SiteUpdateOne`,
          `SiteReplaceOne`,
          `SiteDeleteOne`
        ]
      )
      .create()

    site = await siteFactory.addUser(userAllPerms.user).addUser(userMyPerms.user).create(userAllPerms.organisation)

    const repo = app.get<Repository<Site>>(getRepositoryToken(Site))

    try {
      site1 = await repo.save({
        owner: userAllPerms.user.id,
        organisation: userAllPerms.organisation.id
      })
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    await down(app);
  })

  it('GetAll', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/site`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.length).toEqual(2)
  })
  it('GetMine', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/site`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.length).toEqual(1)
    expect(ret.body[0].id).toEqual(site.id)
  })
  it('GetID', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/site/${site.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.id).toEqual(site.id)
  })
  it('GetIDBad', () => {
    return request(app.getHttpServer())
      .get(`/site/${site1.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .expect(403)
  })

  it('UpdateAllGood', async () => {
    const ret = await request(app.getHttpServer())
      .patch(`/site/${site1.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .send({
        name: 'tester1'
      })
      .expect(200)
    expect(ret.body.name).toEqual('tester1')
  })
  it('UpdateMineGood', async () => {
    const ret = await request(app.getHttpServer())
      .patch(`/site/${site.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .send({
        name: 'UpdateMineGood'
      })
      .expect(200)
    expect(ret.body.name).toEqual('UpdateMineGood')
  })
  it('UpdateAllBad', () => {
    return request(app.getHttpServer())
      .patch(`/site/${site1.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .send({
        name: 'UpdateMineGood'
      })
      .expect(403)
  })

  it('DeleteBad', async () => {
    return request(app.getHttpServer())
      .delete(`/site/${site1.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .expect(403)
  })
  it('DeleteGood', () => {
    return request(app.getHttpServer())
      .delete(`/site/${site1.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
  })
  it('DeleteGoodMine', () => {
    return request(app.getHttpServer())
      .delete(`/site/${site.id}`)
      .set('Authorization', userMyPerms.apiToken)
      .query({
        orgId: userMyPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
  })
});
