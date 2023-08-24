import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailTemplate } from 'src/auto-resources/email-template/email-template.entity';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { Role } from 'src/auto-resources/role/role.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('lostTimeReport', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let user: UserFactoryReturn;
  let userNoPerm: UserFactoryReturn;
  let userFactory: UserFactory;
  let roleUserRepo: Repository<Roleuser>;
  let emailTemplateRepo: Repository<EmailTemplate>
  let orgTemplateRepo: Repository<OrganisationEmailTemplate>
  let oc: OrganisationContractor;

  jest.setTimeout(3000000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))
    roleUserRepo = app.get<Repository<Roleuser>>(getRepositoryToken(Roleuser))

    user = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test',
      mobile: '+447484353311',
      isdeveloper: true
    })
      .create()

    roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role))
    userRepo = app.get<Repository<User>>(getRepositoryToken(User))
    emailTemplateRepo = app.get(getRepositoryToken(EmailTemplate))
    orgTemplateRepo = app.get(getRepositoryToken(OrganisationEmailTemplate))
    
    var ocRepo = app.get(getRepositoryToken(OrganisationContractor))
    oc = await ocRepo.save({ 
      default: true,
      name: user.organisation.name,
      organisation: user.organisation.id,
      owner: user.user.id
    })
  })
  afterAll(async () => {
    await down(app);
  })

  it('getFormSpanish', async () => {
    let { body } = await request(app.getHttpServer())
      .get(`/lost-time-report/form`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null,
        languageCode: 'Spanish'
      })
      .expect(200)
    expect(body)
  })

});