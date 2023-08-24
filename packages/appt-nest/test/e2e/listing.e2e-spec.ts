import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('listingCsv', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userFactory: UserFactory;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
    })
      .addPermissions([`ListingCreateMany`])
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
    })
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('AllPerms', async () => {
    const ret = await request(app.getHttpServer())
      .post(`/listing/csv`)
      .attach('file', 'test/e2e/fixtures/listingUploadTest')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    expect(ret.body.objects.length).toBe(3)
    expect(ret.body.errors.length).toBe(1)
  })
  it('NoPerm', () => {
    return request(app.getHttpServer())
      .post(`/listing/csv`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
});
