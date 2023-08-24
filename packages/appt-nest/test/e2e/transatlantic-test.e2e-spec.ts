import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { TransAtRoleTitles, User } from 'src/auto-resources/user/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('transat', () => {
  let app: INestApplication;
  let user: UserFactoryReturn;
  let userFactory: UserFactory;
  let roleRepo: Repository<Roleuser>;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
			isglobaladmin: true,
			isdeveloper: true
    })
      .create()

    roleRepo = app.get(getRepositoryToken(Roleuser))
  })
  afterAll(async () => {
    await down(app);
  })

  it('get safety observations', async () => {
    await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)


      await request(app.getHttpServer())
      .get(`/safety-observations/opening`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)

      
  })


  it('d11cb2ca-929d-444b-936b-2ede5630da8e create kpi user', async () => {
    let res = await request(app.getHttpServer())
      .post(`/d11cb2ca-929d-444b-936b-2ede5630da8e/kpiuser`)
      .send({
        email: 'alex@appt.digital'
      })
      .expect(201)

    expect((res.body as User).type).toBe(TransAtRoleTitles.KPI_ROLE)
    let roles = await roleRepo.find({ where: { owner: res.body.id }, relations: ['roleModel']})
    expect(roles.length).toBe(1)

  })

	it('get contractor data', async () => {
    await request(app.getHttpServer())
      .get(`/weekly-data-report`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)
  })
	it('get flash report', async () => {
    await request(app.getHttpServer())
      .get(`/incident-flash-report`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)

      await request(app.getHttpServer())
      .get(`/incident-flash-report/form`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)

      await request(app.getHttpServer())
      .get(`/weekly-data-report/form`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)

      
  })
});