import { INestApplication } from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import * as request from 'supertest';
import { Site } from '../../src/auto-resources/site/site.entity';
import { down, up } from './e2eHelpers';
import { SiteFactory } from './factories/site.factory';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('permissionsTest', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userWithSite: UserFactoryReturn;
  let site: Site;
  let siteFactory: SiteFactory;
  let userFactory: UserFactory;
  let apiService: AuthenticationService;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory, siteFactory } = await up())

    apiService = app.get<AuthenticationService>(AuthenticationService)

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
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

    userWithSite = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [`TestAutoApiGetMany`,
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

    site = await siteFactory
      .addUser(userWithSite.user)
      .create(userWithSite.organisation)
  })
  afterAll(async () => {
    await down(app);
  })

  it('Get', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi`)
      .set({
        'Authorization': apiService.generateTokenWithPayload({
          userId: user.user.id,
        })
      })
      .query({
        orgId: user.organisation.id
      })
      .expect(200)
  })
  it('badToken', () => {
    return request(app.getHttpServer())
      .get(`/testautoapi/123`)
      .set({ 'Authorization': '12312312312123' })
      .query({
        orgId: userWithSite.organisation.id,
        siteId: site.id
      })
      .expect(401)
  })
});
