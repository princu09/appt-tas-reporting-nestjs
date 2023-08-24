import { INestApplication } from '@nestjs/common';
import { AuthenticationService, refreshTokenCookieName } from 'src/authentication/authentication.service';
import * as request from 'supertest';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('authTest', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userFactory: UserFactory;
  let authService: AuthenticationService;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    user = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .create()

    authService = app.get(AuthenticationService)
  })
  afterAll(async () => {
    await down(app);
  })

  it('authentication-refresh', async () => {
    let token = authService.getRefreshToken(user.user.id)
    const ret = await request(app.getHttpServer())
      .get(`/authentication/refresh`)
      .set('Cookie', [`${refreshTokenCookieName}=${token}`])
      .expect(200)
    expect(typeof ret.body.token).toEqual('string')
  })
  it('authentication-refresh-badToken', () => {
    let token = authService.getRefreshToken(user.user.id)
    return request(app.getHttpServer())
      .get(`/authentication/refresh`)
      .set('Cookie', [`${refreshTokenCookieName}=${token + '1'}`])
      .expect(403)
  })
  it('authentication-refresh-notoken', () => {
    return request(app.getHttpServer())
      .get(`/authentication/refresh`)
      .expect(403)
  })
});
