import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auto-resources/user/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('user', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let usernoperm: UserFactoryReturn;
  let userFactory: UserFactory;
  let userRepo: Repository<User>;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    userRepo = app.get<Repository<User>>(getRepositoryToken(User))

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions([
        'GetMyUser',
        'GetDirectAccessUsers',
        'GetOrgUsers',
        'GetSiteUsers',
        'GetAllUsers',
        'DeleteMyUser',
        'DeleteOrgUsers',
        'DeleteSiteUsers',
        'DeleteAllUsers',
        'UpdateMyUser',
        'UpdateDirectAccessUsers',
        'UpdateOrgUsers',
        'UpdateSiteUsers',
        'UpdateAllUsers',
        `UserGetMany`,
        `UserGetOne`,
        `UserCreateOne`,
        `UserCreateMany`,
        `UserUpdateOne`,
        `UserReplaceOne`,
        `UserDeleteOne`,
        `UserInvite`,
        `CreateUser`
      ])
      .create()

    usernoperm = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353311',
    })
      .addPermissions([
        `CreateUser1`
      ])
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it('invite', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/user/invite`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        username: 'newuser',
        email: 'alex.taylor@appt.digital',
        firstname: 'alex',
        lastname: 'taylor'
      })
      .expect(201)

    const user1 = await userRepo.findOneOrFail({ username: 'newuser' })
    expect(user1)
    expect(user1.passwordResetToken).not.toBeNull()
  })
  it('inviteBad', () => {
    return request(app.getHttpServer())
      .post(`/user/invite`)
      .set('Authorization', usernoperm.apiToken)
      .query({
        orgId: usernoperm.organisation.id,
        siteId: null
      })
      .send({
        username: 'newuser',
        email: 'alex.taylor@appt.digital',
        firstname: 'alex',
        lastname: 'taylor'
      })
      .expect(403)
  })
  it('createUser', async () => {
    let { body } = await request(app.getHttpServer())
      .post(`/user`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        username: '123@appt.digita',
        email: '123@appt.digita',
        isglobaladmin: true,
        isdeveloper: true
      })
      .expect(201)

    const u = await userRepo.findOne(body.id)

    expect(u.isdeveloper).toBeFalsy()
    expect(u.isglobaladmin).toBeFalsy()
  })
});