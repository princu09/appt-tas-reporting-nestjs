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

describe('MediaE2EPermissions', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userNoChildren: UserFactoryReturn;
  let userWithChildren: UserFactoryReturn;
  let userFactory: UserFactory;

  let mediaRoot: Media = null;
  let mediaChildUserDenied: Media = null;
  let mediaChildNeedRole: Media = null;
  let mediaChildNeedSub: Media = null;

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
        `MediaDeleteOne`,
        `MediaOtherOwner`
      ])
      .create()

    userNoChildren = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions([
        `MediaGetMany`,
        `MediaGetOne`,
        `MediaCreateOne`,
        `MediaCreateMany`,
        `MediaUpdateOne`,
        `MediaReplaceOne`,
        `MediaDeleteOne`,
        `MediaOtherOwner`
      ])
      .create()

    userWithChildren = await userFactory.addData({
      email: 'alex.taylor3@appt.digital',
      username: 'test3',
    })
      .setOrganisation(userAllPerms.organisation)
      .addPermissions([
        `MediaGetMany`,
        `MediaGetOne`,
        `MediaCreateOne`,
        `MediaCreateMany`,
        `MediaUpdateOne`,
        `MediaReplaceOne`,
        `MediaDeleteOne`,
        `MediaOtherOwner`
      ])
      .create()

    let service = app.get(MediaService)
    let risRepo: Repository<MediaRestriction> = app.get(getRepositoryToken(MediaRestriction))
    let subRepo: Repository<Subscription> = app.get(getRepositoryToken(Subscription))
    let subRecRepo: Repository<Subscriptionreceipt> = app.get(getRepositoryToken(Subscriptionreceipt))

    let sub = await subRepo.save({
      ownerModel: userAllPerms.user,
      organisationModel: userAllPerms.organisation
    })

    await subRecRepo.save({
      ownerModel: userWithChildren.user,
      organisationModel: userWithChildren.organisation,
      subscriptionModel: sub
    })

    mediaRoot = await service.repo.save({
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })

    mediaChildUserDenied = await service.repo.save({
      parent: mediaRoot,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user,
    })
    await risRepo.save({
      media: mediaChildUserDenied,
      userDenied: userNoChildren.user,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user,
    })

    mediaChildNeedRole = await service.repo.save({
      parent: mediaRoot,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })
    await risRepo.save({
      media: mediaChildNeedRole,
      roleId: userWithChildren.role.id,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user,
    })

    mediaChildNeedSub = await service.repo.save({
      parent: mediaRoot,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user
    })
    await risRepo.save({
      media: mediaChildNeedSub,
      subscription: sub,
      organisationModel: userAllPerms.organisation,
      ownerModel: userAllPerms.user,
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('mediaGetNoChildren', async () => {
    let data = await request(app.getHttpServer())
      .get(`/media/${mediaRoot.id}`)
      .set('Authorization', userNoChildren.apiToken)
      .query({
        orgId: userNoChildren.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(data.body.children.length).toBe(0)
  })

  it('mediaGetChildren', async () => {
    let data = await request(app.getHttpServer())
      .get(`/media/${mediaRoot.id}`)
      .set('Authorization', userWithChildren.apiToken)
      .query({
        orgId: userWithChildren.organisation.id,
        siteId: null
      })
      .expect(200)

    expect(data.body.children.length).toBe(3)
  })
});
