import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MediaRestriction } from 'src/auto-resources/media-restriction/media-restriction.entity';
import { Media } from 'src/auto-resources/media/media.entity';
import { MediaService } from 'src/auto-resources/media/media.service';
import { Subscriptionreceipt } from 'src/auto-resources/subscription-receipt/subscription-receipt.entity';
import { Subscription } from 'src/auto-resources/subscription/subscription.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('MediaE2E', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userFactory: UserFactory;


  let mediaRoot: Media = null;
  let mediaChildLevel1_1: Media = null;
  let mediaChildLevel1_2: Media = null;
  let mediaChildLevel2_1: Media = null;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
    })
      .addPermissions([
        `MediaGetMany`,
        `MediaGetOne`,
        `MediaCreateOne`,
        `MediaCreateMany`,
        `MediaUpdateOne`,
        `MediaReplaceOne`,
        `MediaDeleteOne`
      ])
      .create()

    let service = app.get(MediaService)
    mediaRoot = await service.repo.save({
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })

    mediaChildLevel1_1 = await service.repo.save({
      parent: mediaRoot,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })

    mediaChildLevel1_2 = await service.repo.save({
      parent: mediaRoot,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })

    mediaChildLevel2_1 = await service.repo.save({
      parent: mediaChildLevel1_2,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it.skip('MediaUpload', async () => {
    const media = await request(app.getHttpServer())
      .post(`/media`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        author: 'Alex',
        title: 'Test'
      })
      .expect(201)

    const ret = await request(app.getHttpServer())
      .post(`/media/${media.body.id}/file`)
      .attach('file', 'test/e2e/fixtures/test.jpeg')
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(201)

    expect(ret.body.record.id)
  })

  it('GettingWithChildrenAndParent', async () => {
    const media = await request(app.getHttpServer())
      .get(`/media/${mediaRoot.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(media.body.children.length).toBe(2)
  })

  it('SettingParent&Child', async () => {
    const media = await request(app.getHttpServer())
      .post(`/media`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        author: 'Alex',
        title: 'Test'
      })
      .expect(201)

    const media2 = await request(app.getHttpServer())
      .post(`/media`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        author: 'Alex',
        title: 'Test'
      })
      .expect(201)

    const media3 = await request(app.getHttpServer())
      .post(`/media`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        author: 'Alex',
        title: 'Test'
      })
      .expect(201)

    const media4 = await request(app.getHttpServer())
      .patch(`/media/${media2.body.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        parent: { id: media.body.id },
        children: [{ id: media3.body.id }]
      })
      .expect(200)

    expect(media4.body.parent.id).toBe(media.body.id)
  })
});
