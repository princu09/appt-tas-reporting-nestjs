import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Record } from 'src/auto-resources/record/record.entity';
import { UPLOAD_RECORD } from 'src/auto-resources/record/record.permissions';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe.skip('recordUpload', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userAllPerms: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let recordRepo: Repository<Record>;

  jest.setTimeout(3000000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    recordRepo = app.get(getRepositoryToken(Record))
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [
          UPLOAD_RECORD,
          'RecordGetMany',
          'RecordGetOne'
        ]
      )
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .addPermissions([])
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('UploadMultiFile', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/record/upload`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('files', `./test/e2e/fixtures/test.jpeg`)
      .attach('files', `./test/e2e/fixtures/test1.jpeg`)
      .attach('files', `./test/e2e/fixtures/test spaces .jpeg`)
      .attach('files', `./test/e2e/fixtures/test + spaces + 😊 + 😊 + utf8.jpeg`)
      .expect(201)

    expect(ret.body.records.length).toBe(4)
    const test = await recordRepo.find({ where: { owner: userAllPerms.user.id, organisation: userAllPerms.organisation.id, site: null } })
    expect(test.length).toBe(4)

    ret = await request(app.getHttpServer())
      .get(`/record`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(ret.body.length).toBe(4)

    await request(app.getHttpServer())
      .get(`/record/${ret.body[0].id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)

    await request(app.getHttpServer())
      .get(`/record/${ret.body[0].id}`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)

    await request(app.getHttpServer())
      .get(`/record`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)

    await request(app.getHttpServer())
      .post(`/record/upload`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .attach('files', `./test/e2e/fixtures/test.jpeg`)
      .attach('files', `./test/e2e/fixtures/test1.jpeg`)
      .expect(403)
  })
});
