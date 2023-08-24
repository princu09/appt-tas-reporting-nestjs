import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { down, up } from '../../../e2e/e2eHelpers';
import { UserFactory, UserFactoryReturn } from '../../../e2e/factories/user.factory';

describe('formTest', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userFactory: UserFactory;

  jest.setTimeout(30000);
  beforeAll(async function () {
    try {

      ({ app, userFactory } = await up())

      userAllPerms = await userFactory.addData({
        email: 'alex.taylor@appt.digital',
        username: 'test',
        mobile: '+447484353311',
      })
        .addPermissions(
          [
            `formsubmissionGetMany`,
            `formsubmissionGetOne`,
            `formsubmissionCreateOne`,
            `formsubmissionCreateMany`,
            `formsubmissionUpdateOne`,
            `formsubmissionReplaceOne`,
            `formsubmissionDeleteOne`,

            `formresponseGetMany`,
            `formresponseGetOne`,
            `formresponseCreateOne`,
            `formresponseCreateMany`,
            `formresponseUpdateOne`,
            `formresponseReplaceOne`,
            `formresponseDeleteOne`,
          ]
        )
        .create()
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    await down(app);
  })

  it('CreateWithResponses', async () => {
    const ret = await request(app.getHttpServer())
      .post(`/formsubmission`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        subject: userAllPerms.user.id,
        responses: [{
          questionkey: 'test',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        },
        {
          questionkey: 'test',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        },
        {
          questionkey: 'test',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        }
        ]
      })
      .expect(201)
    expect(ret.body.responses.length).toEqual(3)

    const ret2 = await request(app.getHttpServer())
      .put(`/formsubmission/${ret.body.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        subject: userAllPerms.user.id,
        responses: [{
          questionkey: 'test1',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        },
        {
          questionkey: 'test1',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        },
        {
          questionkey: 'test1',
          questiontext: 'test',
          response: 'test',
          owner: userAllPerms.user.id,
          organisation: userAllPerms.organisation.id
        }
        ]
      })
      .expect(200)
    expect(ret2.body.responses.length).toEqual(3)
    expect(ret2.body.responses.map(x => x.questionkey)).toEqual(['test1', 'test1', 'test1'])
  })
});
