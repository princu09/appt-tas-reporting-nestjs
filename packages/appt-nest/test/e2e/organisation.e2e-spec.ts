import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Media } from 'src/auto-resources/media/media.entity';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { Record } from 'src/auto-resources/record/record.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { GDPRPermissions } from 'src/gdpr/gdpr.permissions';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('Organisation', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userAllPermsNoGA: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userFactory: UserFactory;
  let orgRepo: Repository<Organisation>;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      isglobaladmin: true
    })
      .addPermissions(GDPRPermissions)
      .create()
      userAllPermsNoGA = await userFactory.addData({
        email: 'alex.taylor123@appt.digital',
        username: 'test123'
      })
        .addPermissions(GDPRPermissions)
        .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1'
    })
      .create()

    orgRepo = app.get(getRepositoryToken(Organisation))
  })
  afterAll(async () => {
    await down(app);
  })
  it('badPerms', async () => {
    await request(app.getHttpServer())
      .delete(`/gdpr`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
    await request(app.getHttpServer())
      .delete(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
    await request(app.getHttpServer())
      .get(`/gdpr`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
    await request(app.getHttpServer())
      .get(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it('gdprGetOtherNoGA', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userAllPermsNoGA.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it('gdprDeleteOther', async () => {
    const ret = await request(app.getHttpServer())
      .delete(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(await app.get<Repository<Record>>(getRepositoryToken(Record)).findAndCount()).toStrictEqual([[], 0])
    expect(await app.get<Repository<Media>>(getRepositoryToken(Media)).findAndCount()).toStrictEqual([[], 0])
    const user = await app
      .get<Repository<User>>(getRepositoryToken(User))
      .findOne(userNoPerms.user.id, { withDeleted: true })
    expect(user.deletedAt).not.toBeNull()
    expect(user.username).toEqual(`Deleted:${user.id}`)
    expect(user.email).toEqual(`Deleted:${user.id}`)
  })
  it('gdprDeleteOtherNoGA', async () => {
    const ret = await request(app.getHttpServer())
      .delete(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userAllPermsNoGA.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it.skip('newLogo', async () => {
    await request(app.getHttpServer())
      .post(`/organisation/uploadlogo`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('file', './test/e2e/fixtures/test.jpeg')
      .expect(201) 

    let { body } = await request(app.getHttpServer())
      .get(`/organisation/${userAllPerms.organisation.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('file', './test/e2e/fixtures/test.jpeg')
      .expect(200) 
      
    expect(body.logo.fileUrl)
  })
  it('gdprDeleteMy', async () => {
    const ret = await request(app.getHttpServer())
      .delete(`/gdpr`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    const user = await app
      .get<Repository<User>>(getRepositoryToken(User))
      .findOne(userAllPerms.user.id, { withDeleted: true })
    expect(user.deletedAt).not.toBeNull()
    expect(user.username).toEqual(`Deleted:${user.id}`)
    expect(user.email).toEqual(`Deleted:${user.id}`)
  })
});
