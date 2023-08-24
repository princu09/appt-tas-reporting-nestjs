import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { notContains } from 'class-validator';
import { EmailTemplateTriggerService } from 'src/auto-resources/email-template/email-template-trigger/email-template-trigger.service';
import { Organisation, TransAtOrgDTO, TransAtOrgUpdateDTO } from 'src/auto-resources/organisation/organisation.entity';
import { Role } from 'src/auto-resources/role/role.entity';
import { TransAtRoleTitles, User } from 'src/auto-resources/user/user.entity';
import { Area } from 'src/trans-atlantic/area/area.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('transatlantic new organisation', () => {
  let app: INestApplication;
  let userAllPerms: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let userFactory: UserFactory;
  let areaRepo: Repository<Area>;
  let contractorRepo: Repository<OrganisationContractor>;
  let orgRepo: Repository<Organisation>;
  let userRepo: Repository<User>;
  let RoleRepo: Repository<Role>;
  let org = null

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      isglobaladmin: true
    })
      .addPermissions([
        `OrganisationCreateOne`
      ])
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1'
    })
      .create()

    let service = app.get(EmailTemplateTriggerService)
    service.triggerOrganisationEmail = jest.fn().mockResolvedValue(1)

    areaRepo = app.get(getRepositoryToken(Area))
    contractorRepo = app.get(getRepositoryToken(OrganisationContractor))
    orgRepo = app.get(getRepositoryToken(Organisation))
    userRepo = app.get(getRepositoryToken(User))
    RoleRepo = app.get(getRepositoryToken(Role))
  })
  afterAll(async () => {
    await down(app);
  })
  it('badPerms', async () => {
    await request(app.getHttpServer())
      .post(`/organisation/transatlantic`)
      .set('Authorization', userNoPerms.apiToken)
      .query({
        orgId: userNoPerms.organisation.id,
        siteId: null
      })
      .expect(403)
  })
  it('good', async () => {
    let req = await request(app.getHttpServer())
      .post(`/organisation/transatlantic`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null,
      })
      .send({
        organisation: {
          name: 'Tester Org',
          projectEndDate: new Date(),
        },
        newContractors: [
          'contractor1',
          'contractor2',
          'contractor3',
          'contractor4',
          'contractor5',
        ],
        newAreas: [
          'area1',
          'area2',
          'area3',
          'area4',
          'area5',
        ],
        kpiUsers: [
          'test123@appt.digital',
          'test124@appt.digital',
          'test125@appt.digital',
          'test126@appt.digital',
          'test127@appt.digital',
        ],
        HSEUsers: [
          'HSEtest123@appt.digital',
          'HSEtest124@appt.digital',
          'HSEtest125@appt.digital',
          'HSEtest126@appt.digital',
          'HSEtest127@appt.digital',
        ]
      } as TransAtOrgDTO)
      .expect(201)
    org = req.body as Organisation
    let contractors = await contractorRepo.find({ organisation: org.id })
    let areas = await areaRepo.find({ organisation: org.id })
    let roles = await RoleRepo.find({ where: { organisation: org.id }, relations: ['roleUsers', 'roleUsers.ownerModel'] })
    let users = await userRepo.find({ relations: ['contractors'] })

    expect(org.enabledKPIs.length).not.toBe(0)

    expect(contractors.find(x => x.name === 'Tester Org').default).toBeTruthy()

    expect(contractors.map(x => x.name).sort()).toEqual(
      [
        'Tester Org',
        'contractor1',
        'contractor2',
        'contractor3',
        'contractor4',
        'contractor5',
      ].sort()
    )
    expect(areas.map(x => x.name).sort()).toEqual(
      [
        'area1',
        'area2',
        'area3',
        'area4',
        'area5',
      ].sort()
    )
    expect(roles.map(x => x.title).sort()).toEqual(
      [
        TransAtRoleTitles.ADMIN_ROLE,
        TransAtRoleTitles.APP_ROLE,
        TransAtRoleTitles.HSE_ROLE,
        TransAtRoleTitles.KPI_ROLE,
      ].sort()
    )
    expect(users.map(x => x.email).sort().filter(x => x)).toEqual(
      [
        'hsetest123@appt.digital',
        'hsetest124@appt.digital',
        'hsetest125@appt.digital',
        'hsetest126@appt.digital',
        'hsetest127@appt.digital',
        'test123@appt.digital',
        'test124@appt.digital',
        'test125@appt.digital',
        'test126@appt.digital',
        'test127@appt.digital',
        'alex.taylor@appt.digital',
        'alex.taylor1@appt.digital'
      ].sort()
    )

    let hseRole = roles.find(x => x.title === TransAtRoleTitles.HSE_ROLE)
    let kpiRole = roles.find(x => x.title === TransAtRoleTitles.KPI_ROLE)
    let adminRole = roles.find(x => x.title === TransAtRoleTitles.ADMIN_ROLE)

    expect(adminRole.roleUsers[0].owner).toEqual(userAllPerms.user.id)

    expect(kpiRole.roleUsers.map(x => (x.ownerModel as User)?.email).sort()).toEqual(
      [
        'test123@appt.digital',
        'test124@appt.digital',
        'test125@appt.digital',
        'test126@appt.digital',
        'test127@appt.digital',
      ].sort()
    )

    expect(hseRole.roleUsers.map(x => (x.ownerModel as User)?.email).sort()).toEqual(
      [
        'hsetest123@appt.digital',
        'hsetest124@appt.digital',
        'hsetest125@appt.digital',
        'hsetest126@appt.digital',
        'hsetest127@appt.digital',
      ].sort()
    )

    expect((app.get(EmailTemplateTriggerService).triggerOrganisationEmail as jest.Mock)).toBeCalledTimes(10)

    req = await request(app.getHttpServer())
      .get(`/organisation/clientdata`)
      .query({
        orgId: org.id,
        siteId: null,
      })
      .set('Authorization', userAllPerms.apiToken)
      .expect(200)
    expect(req.body.data.areas.length).toBe(5)
    expect(req.body.data.contractors.length).toBe(6)
    expect(
      [...new Set(req.body.data.users.map(x => x.type))]
    ).toStrictEqual([TransAtRoleTitles.KPI_ROLE])
  })
  it('updateTransAtOrg', async () => {
    let { body } = await request(app.getHttpServer())
    .get(`/organisation/clientdata`)
    .query({
      orgId: org.id,
      siteId: null,
    })
    .set('Authorization', userAllPerms.apiToken)
    .expect(200)
    body = body.data 
    body.enabledKPIs[0].enabled = false

    body.areas = [body.areas[0]]
    body.contractors[0].name = 'ALEX TEST'
    body.contractors = [body.contractors[0]]

    body.areas.push({ id: v4(), name: '100%Safe' })
    body.contractors.push({ id: v4(), name: '200%Safe' })
    body.DARTMax = 1
    let dto: TransAtOrgUpdateDTO = {
      organisation: body, 
      areas: body.areas,
      contractors: body.contractors,
      newHseUsers: ['4000%Safe@appt.digital'],
      newKpiUsers: ['300%Safe@appt.digital'],
      deletedUsersIds: body.users.slice(1).map(x => x.id),
    }

    await request(app.getHttpServer())
    .patch(`/organisation/transatlantic`)
    .query({
      orgId: org.id,
      siteId: null,
    })
    .send(dto)
    .set('Authorization', userAllPerms.apiToken)
    .expect(200)

    let req = await request(app.getHttpServer())
    .get(`/organisation/clientdata`)
    .query({
      orgId: org.id,
      siteId: null,
    })
    .set('Authorization', userAllPerms.apiToken)
    .expect(200)

    expect(req.body.data.enabledKPIs[0].enabled).toBe(false)
    expect(req.body.data.id).toBe(org.id)
    expect(req.body.data.users.length).toBe(2)
    expect(req.body.data.areas.length).toBe(2)
    expect(req.body.data.contractors.length).toBe(2)
  })
  it('test join', async () => {
    let { body } = await request(app.getHttpServer())
      .get(`/organisation/${userAllPerms.organisation.id}`)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null,
      })
      .set('Authorization', userAllPerms.apiToken)
      .expect(200)
    expect(body.contractors).toBeUndefined()

    let { body: body2 } = await request(app.getHttpServer())
      .get(`/organisation/${userAllPerms.organisation.id}`)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null,
        join: 'contractors'
      })
      .set('Authorization', userAllPerms.apiToken)
      .expect(200)
    expect(body2.contractors).not.toBeNull()
  })
  it('test unsafe org get', async () => {
    let { body } = await request(app.getHttpServer())
      .get(`/organisation/appuser/organisations`)
      .query({
        orgId: null,
        siteId: null,
      })
      .set('Authorization', userAllPerms.apiToken)
      .expect(200) 

    expect(body.length).toBe(2)
  })
})
