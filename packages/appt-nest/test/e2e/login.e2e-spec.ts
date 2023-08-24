import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from 'src/auto-resources/user/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { down, up } from './e2eHelpers';
import { SiteFactory } from './factories/site.factory';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('loginTest', () => {
  const passwordStr = '100%Safe'
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userOther: UserFactoryReturn;
  let userLocked: UserFactoryReturn;
  let userFactory: UserFactory;
  let siteFactory: SiteFactory;
  let userRepo: Repository<User> = null;
  let authService: AuthenticationService;

  let siteAsUser = null
  let siteAsOwner = null
  let siteAsAdmin = null

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory, siteFactory } = await up())

    authService = app.get<AuthenticationService>(AuthenticationService)
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))

    user = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
      password: await authService.generatePassword(passwordStr)
    })
      .create()
    userOther = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test2',
      mobile: '+447484353311',
    })
      .create()
    userLocked = await userFactory.addData({
      email: 'alex.tay123@appt.digital',
      username: 'test123',
      mobile: '+447484353311',
      password: await authService.generatePassword('100%Safe')
    })
      .create()

    siteAsUser = await siteFactory.addUser(userOther.user).addUser(user.user).create(user.organisation)
    siteAsOwner = await siteFactory.addUser(user.user).create(user.organisation)
    siteAsAdmin = await siteFactory.addAdminUser(user.user).addUser(userOther.user).create(user.organisation)
  })
  afterAll(async () => {
    await down(app);
  })

  describe('passwordLock', () => {
    it('lockPassword', async () => {
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)

        // This wont register as a password attempt as the password is locked
      await request(app.getHttpServer())
        .post(`/authentication/login`)
        .send({
          username: userLocked.user.username,
          password: 'asd'
        })
        .expect(401)

      let user = await userRepo.findOne(userLocked.user.id)
      expect(user.passwordAttempts).toEqual(5)
      expect(user.passwordLocked).not.toBeNull()
    })
    it('unlock', async () => {
      let user = await userRepo.findOne(userLocked.user.id)
      user.passwordLocked = moment().subtract(100, 'minute').toDate()
      await userRepo.save(user)

      await authService.expireLockedAccounts()

      await request(app.getHttpServer())
      .post(`/authentication/login`)
      .send({
        username: userLocked.user.username,
        password: '100%Safe'
      })
      .expect(201)
    })
  })

  it('loginGood', async () => {
    const ret = await request(app.getHttpServer())
      .post(`/authentication/login`)
      .send({
        username: 'test',
        password: passwordStr
      })
      .expect(201)

      const cookies = ret.headers['set-cookie']
      expect(cookies.refreshToken)
      expect(ret.body.user.username).toBe('test')
      expect(ret.body.user.password).toBe(undefined)
      expect(ret.body.user.emailverified).toBe(undefined)

      expect(ret.body.sitesAsUser.length).toBe(2)
      expect(ret.body.sitesAsUser.map(x => x.id).sort()).toEqual([siteAsUser.id, siteAsOwner.id].sort())

      expect(ret.body.sitesAsAdmin.length).toBe(1)
      expect(ret.body.sitesAsAdmin[0].id).toBe(siteAsAdmin.id)

      expect(ret.body.userOwnedSites.length).toBe(1)
      expect(ret.body.userOwnedSites[0].id).toBe(siteAsOwner.id)

      expect(ret.body.userOrganisations.length).toBe(1)
      expect(ret.body.userOrganisations[0].id).toBe(user.organisation.id)

      const userTmp = await userRepo.findOne(user.user.id)
      expect(userTmp.lastLoggedIn).not.toBeNull()
  })
  it('loginBadUser', () => {
    return request(app.getHttpServer())
      .post(`/authentication/login`)
      .send({
        username: 'test1',
        password: passwordStr
      })
      .expect(401)
  })
  it('loginBadPassword', () => {
    return request(app.getHttpServer())
      .post(`/authentication/login`)
      .send({
        username: 'test',
        password: passwordStr + 1
      })
      .expect(401)
  })
  it('loginNodata', () => {
    return request(app.getHttpServer())
      .post(`/authentication/login`)
      .expect(400)
  })
});
