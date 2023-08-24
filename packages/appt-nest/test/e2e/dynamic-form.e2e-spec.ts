import { INestApplication } from '@nestjs/common';
import { ChunkUpload } from 'src/auto-resources/chunk-upload/chunk-upload.entity';
import * as request from 'supertest';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('dynamicFormTest', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let userPerms; UserFactoryReturn
  let userPerms2; UserFactoryReturn

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(['testformCreateOne', 'testformUpdateOne'])
      .create()

    userPerms2 = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+4474843533112',
    })
      .addPermissions(['testformCreateOne', 'testformUpdateOne'])
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('Get', async () => {
    await request(app.getHttpServer())
      .get(`/testform`)
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(200)
  })

  it('Post', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/testform`)
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .send({
        firstName: 'Alex'
      })
      .expect(201)

    expect(ret.body)

    ret = await request(app.getHttpServer())
      .patch(`/testform/${ret.body.id}`)
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .send({
        lastName: 'Alex'
      })
      .expect(200)

    expect(ret.body.lastName).toEqual('Alex')

    let id = ret.body.id
    ret = await request(app.getHttpServer())
      .get(`/testform/${ret.body.id}`)
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .send({
        lastName: 'Alex'
      })
      .expect(200)

    expect(ret.body.form)
    expect(ret.body.data)

    let test = await request(app.getHttpServer())
      .get(`/testform/${id}`)
      .set('Authorization', userPerms2.apiToken)
      .query({
        orgId: userPerms2.organisation.id,
        siteId: null
      })
      .expect(403)

    test = await request(app.getHttpServer())
      .patch(`/testform/${id}`)
      .set('Authorization', userPerms2.apiToken)
      .query({
        orgId: userPerms2.organisation.id,
        siteId: null
      })
      .send({
        lastName: 'Alex'
      })
      .expect(403)
  })
});
