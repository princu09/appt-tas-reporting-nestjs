import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Userdirectaccess } from 'src/auto-resources/user-direct-access/user-direct-access.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Site } from '../../../src/auto-resources/site/site.entity';
import { down, up } from '../e2eHelpers';
import { SiteFactory } from '../factories/site.factory';
import { UserFactory, UserFactoryReturn } from '../factories/user.factory';

describe('crudUserTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userAllOrg: UserFactoryReturn;
  let userAllSite: UserFactoryReturn;
  let userAllUserAccess: UserFactoryReturn;
  let userMy: UserFactoryReturn;
  let userDifferentSite: UserFactoryReturn;
  let userDifferentOrg: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userFactory: UserFactory;

  let site: Site;
  let siteFactory: SiteFactory;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory, siteFactory } = await up())

    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [ 'CreateUser',
          'GetMyUser',
          'GetDirectAccessUsers',
          'GetOrgUsers',
          'GetSiteUsers',
          'GetAllUsers',
          'DeleteMyUser',
          'DeleteOrgUsers',
          'DeleteSiteUsers',
          'DeleteAllUsers',
          'UpdateMyUser',
          'UpdateDirectAccessUsers',
          'UpdateOrgUsers',
          'UpdateSiteUsers',
          'UpdateAllUsers',
          `UserGetMany`,
          `UserGetOne`,
          `UserCreateOne`,
          `UserCreateMany`,
          `UserUpdateOne`,
          `UserReplaceOne`,
          `UserDeleteOne`]
      )
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor11@appt.digital',
      username: 'test11',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .create()

    userAllOrg = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        ['GetMyUser',
          'GetDirectAccessUsers',
          'GetOrgUsers',
          'DeleteMyUser',
          'DeleteOrgUsers',
          'UpdateMyUser',
          'UpdateDirectAccessUsers',
          'UpdateOrgUsers',
          `UserGetMany`,
          `UserGetOne`,
          `UserCreateOne`,
          `UserCreateMany`,
          `UserUpdateOne`,
          `UserReplaceOne`,
          `UserDeleteOne`]
      )
      .create()


    userAllSite = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        ['GetMyUser',
          'GetDirectAccessUsers',
          'GetOrgUsers',
          'GetSiteUsers',
          'DeleteMyUser',
          'DeleteOrgUsers',
          'DeleteSiteUsers',
          'DeleteAllUsers',
          'UpdateMyUser',
          'UpdateDirectAccessUsers',
          'UpdateOrgUsers',
          'UpdateSiteUsers',
          `UserGetMany`,
          `UserGetOne`,
          `UserCreateOne`,
          `UserCreateMany`,
          `UserUpdateOne`,
          `UserReplaceOne`,
          `UserDeleteOne`]
      )
      .create()


    userAllUserAccess = await userFactory.addData({
      email: 'alex.taylor3@appt.digital',
      username: 'test3',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        ['GetMyUser',
          'GetDirectAccessUsers',
          'UpdateMyUser',
          'UpdateDirectAccessUsers',
          `UserGetMany`,
          `UserGetOne`,
          `UserCreateOne`,
          `UserCreateMany`,
          `UserUpdateOne`,
          `UserReplaceOne`,
          `UserDeleteOne`]
      )
      .create()

    userMy = await userFactory.addData({
      email: 'alex.taylor4@appt.digital',
      username: 'test4',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        ['GetMyUser',
          'DeleteMyUser',
          'UpdateMyUser',
          `UserGetMany`,
          `UserGetOne`,
          `UserCreateOne`,
          `UserCreateMany`,
          `UserUpdateOne`,
          `UserReplaceOne`,
          `UserDeleteOne`]
      )
      .create()

    userDifferentOrg = await userFactory.addData({
      email: 'alex.taylor5@appt.digital',
      username: 'test5',
      mobile: '+447484353311',
    })
      .create()

    userDifferentSite = await userFactory.addData({
      email: 'alex.taylor6@appt.digital',
      username: 'test6',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .create()
    site = await siteFactory
      .addUser(userAllPerms.user)
      .addUser(userAllOrg.user)
      .addUser(userAllSite.user)
      .addUser(userAllUserAccess.user)
      .addUser(userMy.user)
      .addUser(userDifferentOrg.user)
      .addUser(userNoPerms.user)
      .create(userAllPerms.organisation)

    const udaRepo = app.get<Repository<Userdirectaccess>>(getRepositoryToken(Userdirectaccess));
    await udaRepo.save({
      targetuser: userAllPerms.user.id,
      usergrantedaccess: userAllUserAccess.user.id,
      owner: userAllUserAccess.user.id,
      organisation: userAllUserAccess.organisation.id,
      site: site.id
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('GetAll', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user`)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllPerms.apiToken)
      .expect(200)
    expect(ret.body.length).toEqual(8)
  })
  it('GetAllBad', () => {
    return request(app.getHttpServer())
      .get(`/user`)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userNoPerms.apiToken)
      .expect(403)
  })
  it('GetAllOrg', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user`)
      .query({
        orgId: userAllOrg.organisation.id,
        siteId: site.id,
        s: `{"type": "user"}`
      })
      .set('Authorization', userAllOrg.apiToken)
      .expect(200)
    expect(ret.body.length).toEqual(7)
  })
  it('GetAllSite', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', userAllSite.apiToken)
      .query({
        orgId: userAllSite.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllSite.apiToken)
      .expect(200)
    expect(ret.body.length).toEqual(7)
  })
  it('GetAllSite', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user`)
      .query({
        orgId: userAllSite.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllSite.apiToken)
      .expect(200)
    expect(ret.body.length).toEqual(7)
  })
  it('GetMine', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .expect(200)
    expect(ret.body.length).toEqual(1)
    expect(ret.body[0].id).toEqual(userMy.user.id)
  })
  it('GetMineId', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user/${userMy.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .expect(200)
    expect(ret.body.id).toEqual(userMy.user.id)
  })
  it('GetByIDSite', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user/${userDifferentOrg.user.id}`)
      .query({
        orgId: userAllSite.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllSite.apiToken)
      .expect(200)
    expect(ret.body.id).toEqual(userDifferentOrg.user.id)
  })
  it('GetByIDSiteBad', () => {
    return request(app.getHttpServer())
      .get(`/user/${userDifferentSite.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .expect(403)
  })
  it('GetByIDOrg', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user/${userAllPerms.user.id}`)
      .query({
        orgId: userAllOrg.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllOrg.apiToken)
      .expect(200)
    expect(ret.body.id).toEqual(userAllPerms.user.id)
  })
  it('GetByIDOrgBad', () => {
    return request(app.getHttpServer())
      .get(`/user/${userDifferentOrg.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .expect(403)
  })
  it('GetDirectAccessGood', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/user/${userAllPerms.user.id}`)
      .query({
        orgId: userAllUserAccess.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllUserAccess.apiToken)
      .expect(200)
    expect(ret.body.id).toEqual(userAllPerms.user.id)
  })
  it('GetDirectAccessBad', () => {
    return request(app.getHttpServer())
      .get(`/user/${userDifferentSite.user.id}`)
      .query({
        orgId: userAllUserAccess.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllUserAccess.apiToken)
      .expect(403)
  })

  it('PutMineId', async () => {
    const ret = await request(app.getHttpServer())
      .patch(`/user/${userMy.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .send({
        jobTitle: 'test'
      })
      .expect(200)
    expect(ret.body.id).toEqual(userMy.user.id)
  })
  it('PutByIDSite', async () => {
    const ret = await request(app.getHttpServer())
      .put(`/user/${userDifferentOrg.user.id}`)
      .query({
        orgId: userAllSite.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllSite.apiToken)
      .send({
        jobTitle: 'test'
      })
      .expect(200)
    expect(ret.body.id).toEqual(userDifferentOrg.user.id)
  })
  it('PutByIDSiteBad', () => {
    return request(app.getHttpServer())
      .put(`/user/${userDifferentSite.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .send({
        jobjobTitle: 'test'
      })
      .expect(403)
  })
  it('PutByIDOrg', async () => {
    const ret = await request(app.getHttpServer())
      .put(`/user/${userAllPerms.user.id}`)
      .query({
        orgId: userAllOrg.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllOrg.apiToken)
      .send({
        jobTitle: 'test'
      })
      .expect(200)
    expect(ret.body.id).toEqual(userAllPerms.user.id)
  })
  it('PutByIDOrgBad', () => {
    return request(app.getHttpServer())
      .put(`/user/${userDifferentOrg.user.id}`)
      .query({
        orgId: userMy.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userMy.apiToken)
      .send({
        jobTitle: 'test'
      })
      .expect(403)
  })
  it('PutDirectAccessGood', async () => {
    const ret = await request(app.getHttpServer())
      .put(`/user/${userAllPerms.user.id}`)
      .query({
        orgId: userAllUserAccess.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllUserAccess.apiToken)
      .send({
        jobTitle: 'test'
      })
      .expect(200)
    expect(ret.body.id).toEqual(userAllPerms.user.id)
  })
  it('PutDirectAccessBad', () => {
    return request(app.getHttpServer())
      .put(`/user/${userDifferentSite.user.id}`)
      .set('Authorization', userAllUserAccess.apiToken)
      .query({
        orgId: userAllUserAccess.organisation.id,
        siteId: site.id
      })
      .send({
        jobTitle: 'test'
      })
      .expect(403)
  })
  it('post', async () => {
    return request(app.getHttpServer())
      .post(`/user`)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userAllPerms.apiToken)
      .send({
        username: 'newuser123123',
        email: 'alex.taylor123123@appt.digital',
        firstname: 'alex',
        lastname: 'taylor'
      })
      .expect(201)
  })
  it('postBad', () => {
    return request(app.getHttpServer())
      .post(`/user`)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id
      })
      .set('Authorization', userNoPerms.apiToken)
      .send({
        username: 'newuser',
        email: 'alex.taylorasd@appt.digital',
        firstname: 'alex',
        lastname: 'taylor'
      })
      .expect(403)
  })
});
