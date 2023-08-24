import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailTrigger } from 'src/auto-resources/email-template/email-template-trigger/email-template-triggers';
import { EmailTemplate } from 'src/auto-resources/email-template/email-template.entity';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { Role } from 'src/auto-resources/role/role.entity';
import { TransAtRoleTitles, TransAtUserPermissions, User } from 'src/auto-resources/user/user.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('TransAtUserSignup', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let userDeleteSelf: UserFactoryReturn; 
  let user: UserFactoryReturn;
  let userNoPerm: UserFactoryReturn;
  let userFactory: UserFactory;
  let roleUserRepo: Repository<Roleuser>;
  let emailTemplateRepo: Repository<EmailTemplate>
  let orgTemplateRepo: Repository<OrganisationEmailTemplate>

  let adminUser: UserFactoryReturn;
  let kpiUser: UserFactoryReturn;
  let appUser: UserFactoryReturn;

  jest.setTimeout(3000000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))
    roleUserRepo = app.get<Repository<Roleuser>>(getRepositoryToken(Roleuser))

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions([
        TransAtUserPermissions.CREATE_ADMIN_USER,
        TransAtUserPermissions.CREATE_APP_USER,
        TransAtUserPermissions.CREATE_KPI_USER
      ])
      .create()
    userNoPerm = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353312',
    })
      .create()

    userDeleteSelf = await userFactory.addData({
      email: 'alex.taylor4444@appt.digital',
      username: 'test4444',
      type: TransAtRoleTitles.APP_ROLE
    })
    .setOrganisation(null)
    .setRole(null)
    .create()

    roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role))
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))
    emailTemplateRepo = app.get(getRepositoryToken(EmailTemplate))
    orgTemplateRepo = app.get(getRepositoryToken(OrganisationEmailTemplate))

    let ocRepo = app.get(getRepositoryToken(OrganisationContractor))
    await ocRepo.save({
      default: true,
      name: user.organisation.name,
      organisation: user.organisation.id,
      owner: user.user.id
    })

    await roleRepo.save([{
      title: TransAtRoleTitles.ADMIN_ROLE,
      organisation: user.organisation.id,
      owner: user.user.id
    },
    {
      title: TransAtRoleTitles.KPI_ROLE,
      organisation: user.organisation.id,
      owner: user.user.id
    },
    {
      title: TransAtRoleTitles.APP_ROLE,
      organisation: user.organisation.id,
      owner: user.user.id
    }])


    // Admin user
    // kpi user
    // app user
    adminUser = await userFactory.addData({
      email: 'admin@appt.digital',
      username: 'admin@appt.digital',
      isglobaladmin: true,
      type: TransAtRoleTitles.ADMIN_ROLE
    })
      .addPermissions([
        TransAtUserPermissions.CREATE_ADMIN_USER,
      ])
      .create()

    kpiUser = await userFactory.addData({
      email: 'kpi@appt.digital',
      username: 'kpi@appt.digital',
      isglobaladmin: true,
      type: TransAtRoleTitles.KPI_ROLE
    })
      .setOrganisation(adminUser.organisation)
      .addPermissions([
        TransAtUserPermissions.CREATE_KPI_USER,
      ])
      .create()

    appUser = await userFactory.addData({
      email: 'app@appt.digital',
      username: 'app@appt.digital',
      isglobaladmin: true,
      type: TransAtRoleTitles.APP_ROLE
    })
      .setOrganisation(adminUser.organisation)
      .addPermissions([
        TransAtUserPermissions.CREATE_APP_USER,
      ])
      .create()
  })
  afterAll(async () => {
    await down(app);
  })

  it(`deleteTest`, async () => {
    // No access
    await request(app.getHttpServer())
    .delete(`/user/${adminUser.user.id}`)
    .set('Authorization', appUser.apiToken)
    .query({
      orgId: appUser.organisation.id,
      siteId: null
    })
    .expect(403)

    await request(app.getHttpServer())
    .delete(`/user/${adminUser.user.id}`)
    .set('Authorization', userDeleteSelf.apiToken)
    .expect(403)

    await request(app.getHttpServer())
    .delete(`/user/${userDeleteSelf.user.id}`)
    .set('Authorization', userDeleteSelf.apiToken)
    .expect(200)
  
    await request(app.getHttpServer())
    .delete(`/user/${userDeleteSelf.user.id}`)
    .set('Authorization', userDeleteSelf.apiToken)
    .expect(500)

    await request(app.getHttpServer())
    .delete(`/user/${adminUser.user.id}`)
    .set('Authorization', kpiUser.apiToken)
    .query({
      orgId: kpiUser.organisation.id,
      siteId: null
    })
    .expect(403)

    await request(app.getHttpServer())
    .delete(`/user/${appUser.user.id}`)
    .set('Authorization', kpiUser.apiToken)
    .query({
      orgId: kpiUser.organisation.id,
      siteId: null
    })
    .expect(200)


    await request(app.getHttpServer())
    .delete(`/user/${kpiUser.user.id}`)
    .set('Authorization', adminUser.apiToken)
    .query({
      orgId: adminUser.organisation.id,
      siteId: null
    })
    .expect(200)

    let appU = await userRepo.findOne(appUser.user.id, { withDeleted: true })
    expect(appU.deletedAt).not.toBeNull()
    
    let kpiU = await userRepo.findOne(kpiUser.user.id, { withDeleted: true })
    expect(kpiU.deletedAt).not.toBeNull()

    let adminU = await userRepo.findOne(adminUser.user.id)
    expect(adminU.deletedAt).toBeNull()
  })

  it('inviteTransatlantic', async () => {
    let orgTemp = await orgTemplateRepo.save({
      html: "<%= title  %> <%= content  %>",
      name: "Invite",
      organisationModel: user.organisation,
      ownerModel: user.user,
    })
    await emailTemplateRepo.save({
      title: 'Transat invite',
      fromAddress: 'invite@appt.digital',
      subject: 'Transat invite',
      globalDefault: true,
      active: true,
      content: 'hello  <%= title  %><%= data.password_reset_url %>',
      triggers: [EmailTrigger.new_user_invite],
      organisationModel: user.organisation,
      ownerModel: user.user,
      template: orgTemp
    })

    let res = await request(app.getHttpServer())
    .post(`/user/transatlantic/kpiuser`)
    .set('Authorization', user.apiToken)
    .query({
      orgId: user.organisation.id,
      siteId: null
    })
    .send({
      email: 'alex.taylor@appt.digital',
      username: 'alex.taylor@appt.digital',
    })
    .expect(201)

    expect(res)
  })

  it('signup', async () => {
    await request(app.getHttpServer())
      .post(`/user/transatlantic/usersignup`)
      .send({
        username: 'newuser@appt.digital',
        password: 'tester1234'
      })
      .expect(201)

    let user1 = await userRepo.findOneOrFail({ username: 'newuser@appt.digital' })
    expect(user1)

    await request(app.getHttpServer())
      .post(`/user/transatlantic/usersignup`)
      .send({
        username: 'newuser@appt.digital',
        password: 'tester1234'
      })
      .expect(201)

    user1 = await userRepo.findOneOrFail({ username: 'newuser@appt.digital' })
    expect(user1)
  })

  it('userCreate', async () => {
    await request(app.getHttpServer())
      .post(`/user/transatlantic/adminuser`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        email: 'adminuser@appt.digital',
        username: 'adminuser@appt.digital'
      })
      .expect(201)
    await request(app.getHttpServer())
      .post(`/user/transatlantic/kpiuser`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        email: 'kpiuser@appt.digital',
        username: 'kpiuser@appt.digital',
      })
      .expect(201)
    await request(app.getHttpServer())
      .post(`/user/transatlantic/appuser`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        email: 'appuser@appt.digital',
        username: 'appuser@appt.digital',
      })
      .expect(201)

    let admin = await userRepo.findOne({
      where: {
        username: 'adminuser@appt.digital'
      },
      relations: ['roles']
    })
    expect(admin.roles[0].roleModel.title).toBe(TransAtRoleTitles.ADMIN_ROLE)

    let kpi = await userRepo.findOne({
      where: {
        username: 'kpiuser@appt.digital'
      },
      relations: ['roles']
    })
    expect(kpi.roles[0].roleModel.title).toBe(TransAtRoleTitles.KPI_ROLE)

    let appu = await userRepo.findOne({
      where: {
        username: 'appuser@appt.digital'
      },
      relations: ['roles', 'contractors']
    })
    expect(appu.roles[0].roleModel.title).toBe(TransAtRoleTitles.APP_ROLE)
    expect(appu.contractors[0].default).toBeTruthy()
  })
  it('NoOrg', async () => {
    await request(app.getHttpServer())
      .post(`/user/transatlantic/kpiuser`)
      .set('Authorization', user.apiToken)
      .send({
        email: 'newuser@appt.digital',
      })
      .expect(403)
  })
  it('NoApitoken', async () => {
    await request(app.getHttpServer())
      .post(`/user/transatlantic/appuser`)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        email: 'newuser@appt.digital',
      })
      .expect(400)
  })
  it('noperm', async () => {
    await request(app.getHttpServer())
      .post(`/user/transatlantic/adminuser`)
      .set('Authorization', userNoPerm.apiToken)
      .query({
        orgId: userNoPerm.organisation.id,
        siteId: null
      })
      .send({
        email: 'newuser@appt.digital',
      })
      .expect(403)
  })
});