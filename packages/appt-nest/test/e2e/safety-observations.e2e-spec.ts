import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailTemplate } from 'src/auto-resources/email-template/email-template.entity';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { Role } from 'src/auto-resources/role/role.entity';
import { TransAtRoleTitles, TransAtUserPermissions, User } from 'src/auto-resources/user/user.entity';
import { OrganisationContractor } from 'src/trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { SafetyObservations } from 'src/trans-atlantic/safety-observations/safety-observations.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

describe('SafetyObservations', () => {
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

  it('safetyobs', async () => {
    let { body } = await request(app.getHttpServer())
      .post(`/safety-observations`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        dateObserved: new Date(),
      })
      .expect(201)

      let data: SafetyObservations = body

    let { body: patch } = await request(app.getHttpServer())
      .patch(`/safety-observations/${body.id}`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .send({
        dateObserved: data.dateObserved,
        owner: data.owner,
        organisation: data.organisation,
        contractorId: oc.id
      })
      .expect(200)

    expect(patch.contractorId).not.toBeFalsy()
    {
      let { body } = await request(app.getHttpServer())
        .get(`/safety-observations`)
        .set('Authorization', user.apiToken)
        .query({
          orgId: user.organisation.id,
          siteId: null
        })
        .expect(200)

      expect(body[0].contractor.name).toBe(user.organisation.name)
    }
  })

  it('getForm', async () => {
    let { body } = await request(app.getHttpServer())
      .get(`/safety-observations/opening`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)
      expect(body)

      expect(body.data[1].questions[0].options[0].description).toEqual('testOrg')
      expect(body.data[1].questions[0].options[0].label).toEqual('testOrg')
      expect(body.data[1].questions[0].options[0].value).toEqual(oc.id)
  })

  it('getFormSpanish', async () => {
    let { body } = await request(app.getHttpServer())
      .get(`/safety-observations/opening`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null,
        languageCode: 'Spanish'
      })
      .expect(200)
    expect(body)
  })

  describe('Get By Contractor', () => {
    let appUser: UserFactoryReturn = null
    let kpiUser: UserFactoryReturn = null
    let ocWeArentIn: OrganisationContractor = null 
    let ocWeAreIn: OrganisationContractor = null

    let toReturn: SafetyObservations = null
    let toReturn2: SafetyObservations = null
    let notReturn: SafetyObservations = null
    beforeAll(async () => {
      appUser = await userFactory.addData({
        email: 'alex.taylor2@appt.digital',
        username: 'tes2',
        type: TransAtRoleTitles.APP_ROLE
      })
        .setOrganisation(user.organisation)
        .addPermissions(['safety-observationsGetMany', 'safety-observationsotherowner'])
        .create()

        kpiUser = await userFactory.addData({
          email: 'alex.taylor3@appt.digital',
          username: 'tes3',
          type: TransAtRoleTitles.KPI_ROLE
        })
          .addPermissions([
            'getorgusers',
            `usergetmany`,
            `usergetone`,
            'updateorgusers',
            `usercreateone`,
            `usercreatemany`,
            `userupdateone`,
            `userreplaceone`,
            `userdeleteone`,
            TransAtUserPermissions.CREATE_APP_USER,
            TransAtUserPermissions.CREATE_KPI_USER,
          
            'getmyorg',
            'organisationgetmany',
          
            // area all org
            `areaotherowner`,
            `areagetmany`,
            `areagetone`,
            `areacreateone`,
            `areacreatemany`,
            `areaupdateone`,
            `areareplaceone`,
            `areadeleteone`,
            // contract data report all org
            `contractor-data-reportotherowner`,
            `contractor-data-reportgetmany`,
            `contractor-data-reportgetone`,
            `contractor-data-reportcreateone`,
            `contractor-data-reportcreatemany`,
            `contractor-data-reportupdateone`,
            `contractor-data-reportreplaceone`,
            `contractor-data-reportdeleteone`,
          
            // kpi all org
            'getkpis',
          
            `incident-flash-reportotherowner`,
            `incident-flash-reportgetmany`,
            `incident-flash-reportgetone`,
            `incident-flash-reportcreateone`,
            `incident-flash-reportcreatemany`,
            `incident-flash-reportupdateone`,
            `incident-flash-reportreplaceone`,
            `incident-flash-reportdeleteone`,
          
            `organisationcontractorotherowner`,
            `organisationcontractorgetmany`,
            `organisationcontractorgetone`,
            `organisationcontractorcreateone`,
            `organisationcontractorcreatemany`,
            `organisationcontractorupdateone`,
            `organisationcontractorreplaceone`,
            `organisationcontractordeleteone`,
            `organisationcontractorassign`,
          
            `safety-observationsotherowner`,
            `safety-observationsgetmany`,
            `safety-observationsgetone`,
            `safety-observationscreateone`,
            `safety-observationscreatemany`,
            `safety-observationsupdateone`,
            `safety-observationsreplaceone`,
            `safety-observationsdeleteone`,
          ])
          .create()
      let ocRepo = app.get<Repository<OrganisationContractor>>(getRepositoryToken(OrganisationContractor))
      let safRepo = app.get<Repository<SafetyObservations>>(getRepositoryToken(SafetyObservations))


      ocWeArentIn = await ocRepo.save({
        name: user.organisation.name,
        organisation: user.organisation.id,
        owner: user.user.id
      })

      ocWeAreIn = await ocRepo.save({
        name: 'we are in',
        organisation: user.organisation.id,
        owner: user.user.id,
        users: [appUser.user]
      })
      
      toReturn = await safRepo.save({
        owner: user.user.id,
        organisation: user.organisation.id,
        contractorId: ocWeAreIn.id
      })
      toReturn2 = await safRepo.save({
        owner: user.user.id,
        organisation: user.organisation.id,
        contractorId: ocWeAreIn.id,
        closingSignature: true
      })
      notReturn = await safRepo.save({
        owner: user.user.id,
        organisation: user.organisation.id,
        contractorId: ocWeArentIn.id
      })
    })

    it('GetMany-app', async () => {
      let { body } = await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', kpiUser.apiToken)
      .query({
        orgId: kpiUser.organisation.id,
        siteId: null,
        s: `{ "$or": [{"closingSignature": { "$isnull": true }}], "$and": [{"closingSignature": { "$isnull": true }}]}`
      })
      .expect(200)
      expect(body.length).toBe(0)

      await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', kpiUser.apiToken)
      .query({
        orgId: kpiUser.organisation.id,
        siteId: null,
        s: `{ "$or": [{"organisation": ${appUser.organisation.id}}], "$and": [{"organisation": ${appUser.organisation.id}}, {"closingSignature": { "$isnull": true }}]}`
      })
      .expect(400)
    })

    it('GetMany-app', async () => {
      let { body } = await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', appUser.apiToken)
      .query({
        orgId: appUser.organisation.id,
        siteId: null
      })
      .expect(200)
      expect(body.map(x => x.id).sort()).toEqual([
        toReturn.id,
        toReturn2.id
      ].sort())
    })
    it('GetMany-app-closed', async () => {
      let { body } = await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', appUser.apiToken)
      .query({
        orgId: appUser.organisation.id,
        siteId: null,
        s: JSON.stringify({ "closingSignature": { "$isnull": true } })
      })
      .expect(200)
      expect(body.map(x => x.id).sort()).toEqual([
        toReturn.id,
      ].sort())
    })
    it('GetManyNonApp', async () => {
      let { body } = await request(app.getHttpServer())
      .get(`/safety-observations`)
      .set('Authorization', user.apiToken)
      .query({
        orgId: user.organisation.id,
        siteId: null
      })
      .expect(200)
      expect(body.length).toBeGreaterThan(2)
    })
  })
});