import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Audittrail } from 'src/auto-resources/audit-trail/audit-trail.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { Record } from 'src/auto-resources/record/record.entity';
import { GDPRPermissions } from 'src/gdpr/gdpr.permissions';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';
import { Media } from 'src/auto-resources/media/media.entity';

describe('gdprTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userAllPermsNoGA: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userFactory: UserFactory;

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

    const record = await app.get<Repository<Record>>(getRepositoryToken(Record)).save({
      ownerModel: userNoPerms.user, 
      organisationModel: userNoPerms.organisation,
      fileName: 'test',
      fileUrl: 'test',
      fileType: 'test'
    })

    const media = await app.get<Repository<Media>>(getRepositoryToken(Media)).save({
      ownerModel: userNoPerms.user, 
      organisationModel: userNoPerms.organisation,
      record: record
    })

    await app.get<Repository<Audittrail>>(getRepositoryToken(Audittrail)).save({
      subject: userAllPerms.user.id,
      owner: userNoPerms.user.id,
      organisation: userAllPerms.organisation.id
    })
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
  it('gdprGetOther', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/gdpr/${userNoPerms.user.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret.body.Audittrail[0].owner).toEqual(userNoPerms.user.id)
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
  it('gdprGetMy', async () => {
    const ret = await request(app.getHttpServer())
      .get(`/gdpr`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret.body.Audittrail.length).toEqual(1)
    expect(ret.body.Audittrail[0].owner).toEqual(userNoPerms.user.id)
    expect(ret.body.Audittrail[0].subject).toEqual(userAllPerms.user.id)
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
