import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from 'src/auto-resources/user/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('passwordReset', () => {
  const passwordStr = '100%Safe'
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userFactory: UserFactory;
  let userRepo: Repository<User>;
  const token = v4()
  const token1 = v4()

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    const auth = app.get<AuthenticationService>(AuthenticationService)
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))
    user = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      password: await auth.generatePassword(passwordStr),
      passwordResetToken: token,
      deleted: false
    })
      .create()
    await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      password: await auth.generatePassword(passwordStr),
      passwordResetToken: token1,
      type: 'borrower'
    })
      .create()
    process.env.DEFAULT_ORG_UUID = user.organisation.id
    auth.sendPasswordResetEmail = jest.fn()
  })
  afterAll(async () => {
    await down(app);
  })

  it('badResetToken', () => {
    return request(app.getHttpServer())
      .post(`/authentication/password-reset`)
      .send({
        password: '100%',
        token: v4()
      })
      .expect(403)
  })
  it('goodReset', async () => {
    await request(app.getHttpServer())
      .post(`/authentication/password-reset`)
      .send({
        password: '200%Safe',
        token: token
      })
      .expect(201)

    const u = await userRepo.findOne(user.user.id)
    expect(u.passwordResetToken).toBeNull()
  })

  it('RequestPasswordReset', async () => {
    const ret = await request(app.getHttpServer())
      .post(`/authentication/request/password-reset`)
      .send({
        email: 'alex.taylor@appt.digital',
      })
      .expect(201)
    expect(ret.body.token)

    const userTest = await userRepo.findOne({ email: 'alex.taylor@appt.digital' })
    expect(userTest.passwordResetToken).toBe(ret.body.token)
  })
  it('RequestPasswordResetBad', () => {
    return request(app.getHttpServer())
      .post(`/authentication/request/password-reset`)
      .send({
        email: 'alex.123123taylor1@appt.digital',
      })
      .expect(400)
  })
  it('RequestPasswordResetBadNoOrgOrSite', () => {
    return request(app.getHttpServer())
      .post(`/authentication/request/password-reset`)
      .send({
        email: 'alex.123123taylor1@appt.digital',
      })
      .expect(400)
  })
});