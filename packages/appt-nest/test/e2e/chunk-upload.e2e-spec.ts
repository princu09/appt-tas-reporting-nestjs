import { INestApplication } from '@nestjs/common';
import { ChunkUpload } from 'src/auto-resources/chunk-upload/chunk-upload.entity';
import * as request from 'supertest';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe.skip('chunkUpload', () => {
  let app: INestApplication;
  let userFactory: UserFactory
  let userPerms; UserFactoryReturn
  let userNoPerms; UserFactoryReturn

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
    .addPermissions(['chunkuploadCreateOne'])
      .create()
    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('uploadTest', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/chunk-upload/start`)
      .send({
        filename: 'test.jpeg'
      })
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    let upload = ret.body as ChunkUpload

    await request(app.getHttpServer())
      .post(`/chunk-upload/chunk/${upload.id}/1`)
      .attach('file', 'test/e2e/fixtures/random.png.aa')
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    await request(app.getHttpServer())
      .post(`/chunk-upload/chunk/${upload.id}/2`)
      .attach('file', 'test/e2e/fixtures/random.png.ab')
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    await request(app.getHttpServer())
      .post(`/chunk-upload/chunk/${upload.id}/3`)
      .attach('file', 'test/e2e/fixtures/random.png.ac')
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    await request(app.getHttpServer())
      .post(`/chunk-upload/chunk/${upload.id}/4`)
      .attach('file', 'test/e2e/fixtures/random.png.ad')
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    ret = await request(app.getHttpServer())
      .get(`/chunk-upload/finish/${upload.id}`)
      .set('Authorization', userPerms.apiToken)
      .query({
        orgId: userPerms.organisation.id,
        siteId: null
      })
      .expect(200)


    expect(ret.body.finishedRecord)
    expect(ret.body.fileName).toBe('test.jpeg')
    expect(ret.body.fileType).toBe('jpeg')
  })
});
