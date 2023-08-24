import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Site } from '../../../src/auto-resources/site/site.entity';
import { down, up } from '../e2eHelpers';
import { SiteFactory } from '../factories/site.factory';
import { UserFactory, UserFactoryReturn } from '../factories/user.factory';
import { TestAutoApi } from './test-code/test-auto-api.entity';

describe('crudTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userAllPermsNoOther: UserFactoryReturn;
  let userAllPermsNoViewAllOrg: UserFactoryReturn;
  let userAllPermsNoViewAllSite: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userAllPermsDifferentOrg: UserFactoryReturn;
  let userFactory: UserFactory;
  let autoApiRepo: TestAutoApi;
  let autoApiRepoNoAccess: TestAutoApi;
  let site: Site;
  let site2: Site;
  let siteFactory: SiteFactory;

  let testAutoApiRepo: Repository<TestAutoApi>

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory, siteFactory } = await up())

    testAutoApiRepo = app.get(getRepositoryToken(TestAutoApi));

    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [`TestAutoApiGetMany`,
          `TestAutoApiGetOne`,
          `TestAutoApiCreateOne`,
          `TestAutoApiCreateMany`,
          `TestAutoApiUpdateOne`,
          `TestAutoApiReplaceOne`,
          `TestAutoApiDeleteOne`,
          `TestAutoApiOtherOrg`,
          `TestAutoApiotherSite`,
          `TestAutoApiotherowner`,
          `TestAutoApiAllOrg`,
          `TestAutoApiAllSite`,
        ]
      )
      .create()


    userAllPermsNoViewAllOrg = await userFactory.addData({
      email: 'alex.taylo33333r@appt.digital',
      username: 'test3333',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        [`TestAutoApiGetMany`,
          `TestAutoApiGetOne`,
          `TestAutoApiCreateOne`,
          `TestAutoApiCreateMany`,
          `TestAutoApiUpdateOne`,
          `TestAutoApiReplaceOne`,
          `TestAutoApiDeleteOne`,
          `TestAutoApiAllOrg`,
        ]
      )
      .create()

    userAllPermsNoViewAllSite = await userFactory.addData({
      email: 'alex.taylor222222@appt.digital',
      username: 'test22222',
      mobile: '+447484353311',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions(
        [`TestAutoApiGetMany`,
          `TestAutoApiGetOne`,
          `TestAutoApiCreateOne`,
          `TestAutoApiCreateMany`,
          `TestAutoApiUpdateOne`,
          `TestAutoApiReplaceOne`,
          `TestAutoApiDeleteOne`,
          `TestAutoApiAllSite`,
        ]
      )
      .create()

    userAllPermsNoOther = await userFactory.addData({
      email: 'alex.taylor11111@appt.digital',
      username: 'test11',
      mobile: '+447484353311',
    })
      .addPermissions(
        [`TestAutoApiGetMany`,
          `TestAutoApiGetOne`,
          `TestAutoApiCreateOne`,
          `TestAutoApiCreateMany`,
          `TestAutoApiUpdateOne`,
          `TestAutoApiReplaceOne`,
          `TestAutoApiDeleteOne`,
        ]
      )
      .create()

    userAllPermsDifferentOrg = await userFactory.addData({
      email: 'alex.taylor22@appt.digital',
      username: 'test22',
      mobile: '+4422484353311',
    })
      .addPermissions(
        [`TestAutoApiGetMany`,
          `TestAutoApiGetOne`,
          `TestAutoApiCreateOne`,
          `TestAutoApiCreateMany`,
          `TestAutoApiUpdateOne`,
          `TestAutoApiReplaceOne`,
          `TestAutoApiDeleteOne`]
      )
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353312',
    })
      .setOrganisation(userAllPerms.organisation)
      .create()

    site = await siteFactory ///// Update the users role/roleuser to set it to the site.
      .addUser(userAllPerms.user)
      .addUser(userNoPerms.user)
      .addUser(userAllPermsNoOther.user)
      .addUser(userAllPermsNoViewAllSite.user)
      .addUser(userAllPermsNoViewAllOrg.user)
      .create(userAllPerms.organisation)

    site2 = await siteFactory
      .addUser(userAllPermsDifferentOrg.user)
      .create(userAllPermsDifferentOrg.organisation)

    autoApiRepo = await testAutoApiRepo.save({
      text: 'Hello World!',
      someNumber: 47,
      ownerModel: userAllPerms.user,
      organisationModel: userAllPerms.organisation,
      siteModel: site
    })

    autoApiRepoNoAccess = await testAutoApiRepo.save({
      text: 'Hello World!',
      someNumber: 47,
      ownerModel: userNoPerms.user,
      organisationModel: userNoPerms.organisation,
      siteModel: site
    })

    await testAutoApiRepo.save({
      text: 'Hello World!',
      someNumber: 47,
      ownerModel: userAllPermsDifferentOrg.user,
      organisationModel: userAllPermsDifferentOrg.organisation,
      siteModel: site2
    })

    await testAutoApiRepo.save({
      text: 'Hello World!',
      someNumber: 47,
      ownerModel: userAllPermsNoOther.user,
      organisationModel: userAllPermsNoOther.organisation,
      siteModel: site2
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('GetOneUserTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/user`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOneUserTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/userModel`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOneOrgTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/organisation`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOneOrgTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/organisationModel`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOneSiteTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/siteModel`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOneSiteTest', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}/site`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(404)
  })
  it('GetOne', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepo.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.id).toEqual(autoApiRepo.id)
  })


  it('GetOneBad', async () => {
    await request(app.getHttpServer())
      .get(`/testautoapi/${autoApiRepoNoAccess.id}`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id
      })
      .expect(403)
  })

  it('GetMany', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id
      })
      .expect(200)

    let count = await testAutoApiRepo.count({ organisation: userAllPerms.organisation.id })
    expect(ret.body.length).toEqual(count)

    for (const test of ret.body as TestAutoApi[]) {
      expect(test.organisation).toBe(userAllPerms.organisation.id)
    }
  })

  it('GetManyJustMine', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPermsNoOther.apiToken)
      .query({
        orgId: userAllPermsNoOther.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.length).toEqual(1)
    expect(ret.body[0].owner).toEqual(userAllPermsNoOther.user.id)
    expect(ret.body[0].organisation).toEqual(userAllPermsNoOther.organisation.id)
  })

  it('GetManyJustOrg', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .expect(200)
    expect(ret.body.length).toEqual(2)
    expect(ret.body.map(x => x.organisation)).toEqual([userAllPermsNoViewAllOrg.organisation.id, userAllPermsNoViewAllOrg.organisation.id])
  })

  it('GetManyJustSite', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllSite.apiToken)
      .query({
        orgId: userAllPermsNoViewAllSite.organisation.id,
        siteId: site.id
      })
      .expect(200)
    expect(ret.body.length).toEqual(2)
    expect(ret.body.map(x => x.site)).toEqual([site.id, site.id])
  })

  it('GetManyJustSiteBadSite', async () => {
    return await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllSite.apiToken)
      .query({
        orgId: userAllPermsNoViewAllSite.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ site: { '$eq': site2.id }})
      })
      .expect(403)
  })

  it('BadSearchParam', async () => {
    return await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPermsNoOther.apiToken)
      .query({
        orgId: userAllPermsNoOther.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ organisation: { '$eq': userAllPermsNoOther.organisation.id + 1 } })
      })
      .expect(403)
  })

  it('GetManyBad', async () => {
    await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id
      })
      .expect(403)
  })

  it('GetBadOrg', async () => {
    return request(app.getHttpServer())
      .get(`/testautoapi`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ organisation: { '$eq': userNoPerms.organisation.id + 1 } })
      })
      .expect(403)
  })
  it('GetBadSite', async () => {
    return request(app.getHttpServer())
      .get(`/testautoapi`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ site: { '$eq': site.id + 1 } })
      })
      .expect(403)
  })
  it('GetBadOwner', async () => {
    return request(app.getHttpServer())
      .get(`/testautoapi`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ owner: { '$eq': userNoPerms.user.id + 1 } })
      })
      .expect(403)
  })
  it('GetByOrg', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ organisation: { '$eq': userAllPermsDifferentOrg.organisation.id } })
      })
      .expect(200)
    expect(ret.body.length).toEqual(
      +(await testAutoApiRepo.count({ organisation: userAllPermsDifferentOrg.organisation.id }))
    )
    expect(ret.body.map(x => x.organisation)).toEqual([userAllPermsDifferentOrg.organisation.id])
  })
  it('GetBySite', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ site: { '$eq': site2.id }})
      })
      .expect(200)
    expect(ret.body.length).toEqual(2)
    expect(ret.body.map(x => x.site)).toEqual([site2.id, site2.id])
  })
  it('GetByOwner', async () => {
    const ret = await request(app.getHttpServer())
      .get('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
        s: JSON.stringify({ owner: { '$eq': userAllPermsDifferentOrg.user.id } })
      })
      .expect(200)
    expect(ret.body.length).toEqual(1)
    expect(ret.body[0].owner).toEqual(userAllPermsDifferentOrg.user.id)
  })

  it('PostGood', async () => {
    const test = await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 1
      })
      .expect(201)
    expect(test.body.owner).toEqual(userAllPerms.user.id)
    expect(test.body.organisation).toEqual(userAllPerms.organisation.id)
    expect(test.body.site).toEqual(site.id)
  })
  it('PostBad', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 1
      })
      .expect(403)
  })
  it('PostBadDTO', async () => {
    await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 'TEST'
      })
      .expect(400)
  })
  it('PostManyGood', async () => {
    const test = await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [
          {
            text: 'test',
            someNumber: 1
          },
          {
            text: 'test',
            someNumber: 1
          }
        ]
      })
      .expect(201)
    expect(test.body.length).toEqual(2)
    expect(test.body[0].owner).toEqual(userAllPerms.user.id)
    expect(test.body[0].organisation).toEqual(userAllPerms.organisation.id)
    expect(test.body[0].site).toEqual(site.id)
    expect(test.body[1].owner).toEqual(userAllPerms.user.id)
    expect(test.body[1].organisation).toEqual(userAllPerms.organisation.id)
    expect(test.body[1].site).toEqual(site.id)
  })
  it('PostManyBad', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [
          {
            text: 'test',
            someNumber: 1
          },
          {
            text: 'test',
            someNumber: 1
          }
        ]
      })
      .expect(403)
  })

  it('PostBadOrg', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 1,
        organisation: site2.id
      })
      .expect(403)
  })
  it('PostBadOrgMany', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [{
          text: 'test',
          someNumber: 1,
          organisation: site2.id
        }, {
          text: 'test',
          someNumber: 1,
        }]
      })
      .expect(403)
  })
  it('PostBadOwner', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 1,
        owner: userAllPermsNoViewAllOrg.user.id + 1
      })
      .expect(403)
  })
  it('PostBadOwnerMany', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [{
          text: 'test',
          someNumber: 1,
          owner: userAllPermsNoViewAllOrg.user.id + 1
        }, {
          text: 'test',
          someNumber: 1,
        }]
      })
      .expect(403)
  })
  it('PostSiteOwner', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        text: 'test',
        someNumber: 1,
        site: site.id + 1
      })
      .expect(403)
  })
  it('PostSiteBadMany', async () => {
    return await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userAllPermsNoViewAllOrg.apiToken)
      .query({
        orgId: userAllPermsNoViewAllOrg.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [{
          text: 'test',
          someNumber: 1,
          site: site.id + 1
        }, {
          text: 'test',
          someNumber: 1,
        }]
      })
      .expect(403)
  })
  it('PostAllDifferent', async () => {
    const test = await request(app.getHttpServer())
      .post('/testautoapi/bulk')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: site.id,
      })
      .send({
        bulk: [{
          text: 'test',
          someNumber: 1,
          site: site2.id
        }, {
          text: 'test',
          someNumber: 1,
          organisation: userAllPermsNoOther.organisation.id
        },
        {
          text: 'test',
          someNumber: 1,
          owner: userAllPermsNoOther.user.id,
          organisation: userAllPermsNoOther.organisation.id,
          site: site2.id
        }]
      })
      .expect(201)

    expect(test.body[0].site).toEqual(site2.id)
    expect(test.body[1].organisation).toEqual(userAllPermsNoOther.organisation.id)
    expect(test.body[2].owner).toEqual(userAllPermsNoOther.user.id)
    expect(test.body[2].organisation).toEqual(userAllPermsNoOther.organisation.id)
    expect(test.body[2].site).toEqual(site2.id)
  })

  describe('replace', () => {
    let badSite: TestAutoApi;
    let badOrg: TestAutoApi;
    let badOwner: TestAutoApi;
    let good: TestAutoApi;

    beforeAll(async () => {
      badSite = await testAutoApiRepo.save({
        text: '1',
        someNumber: 1,
        site: site2.id
      })
      badOrg = await testAutoApiRepo.save({
        text: '1',
        someNumber: 1,
        organisation: userAllPermsNoOther.organisation.id
      })
      badOwner = await testAutoApiRepo.save({
        text: '1',
        someNumber: 1,
        owner: userAllPerms.user.id
      })
      good = await testAutoApiRepo.save({
        text: '1',
        someNumber: 1,
        owner: userAllPermsNoOther.user.id,
        organisation: userAllPermsNoOther.organisation.id,
        site: site.id
      })
    })

    it('ReplaceGood', async () => {
      const data = await request(app.getHttpServer())
        .put(`/testautoapi/${autoApiRepoNoAccess.id}`)
        .set('Authorization', userAllPerms.apiToken)
        .query({
          orgId: userAllPerms.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(200)

      expect(data.body.text).toEqual('replaceGood')
      expect(data.body.someNumber).toEqual(2)
      expect(data.body.owner).toEqual(userAllPerms.user.id)
      expect(data.body.organisation).toEqual(userAllPerms.organisation.id)
      expect(data.body.site).toEqual(site.id)
    })
    it('replaceBad', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${autoApiRepoNoAccess.id}`)
        .set('Authorization', userNoPerms.apiToken)
        .query({
          orgId: userNoPerms.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadSearchOrg', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${badOrg.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadSearchOwner', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${badOwner.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadSearchSite', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${badSite.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadBodyUser', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          owner: userAllPermsNoOther.user.id + 1,
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadBodyOrg', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          organisation: userAllPermsNoOther.organisation.id + 1,
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadBodySite', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          site: site.id + 1,
          text: 'replaceGood',
          someNumber: 2
        })
        .expect(403)
    })
    it('ReplaceBadDTO', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: 2,
          someNumber: 2
        })
        .expect(400)
    })
    it('ReplaceOK', async () => {
      return await request(app.getHttpServer())
        .put(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: '2',
          someNumber: 2
        })
        .expect(200)
    })

    it('updateGood', async () => {
      return await request(app.getHttpServer())
        .patch(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .send({
          text: '12345',
          someNumber: 1
        })
        .expect(200)
    })

    it('DeleteBadSearchOrg', async () => {
      return await request(app.getHttpServer())
        .delete(`/testautoapi/${badOrg.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .expect(403)
    })
    it('DeleteBadSearchOwner', async () => {
      return await request(app.getHttpServer())
        .delete(`/testautoapi/${badOwner.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .expect(403)
    })
    it('DeleteBadSearchSite', async () => {
      return await request(app.getHttpServer())
        .delete(`/testautoapi/${badSite.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .expect(403)
    })

    it('deleteGood', async () => {
      return await request(app.getHttpServer())
        .delete(`/testautoapi/${good.id}`)
        .set('Authorization', userAllPermsNoOther.apiToken)
        .query({
          orgId: userAllPermsNoOther.organisation.id,
          siteId: site.id,
        })
        .expect(200)
    })
  })
});
