import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailTemplate } from 'src/auto-resources/email-template/email-template.entity';
import { SEND_EMAIL_TEMPLATE } from 'src/auto-resources/email-template/email-template.permissions';
import { Record } from 'src/auto-resources/record/record.entity';
import { UPLOAD_RECORD } from 'src/auto-resources/record/record.permissions';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { down, up } from '../e2eHelpers';
import { UserFactory, UserFactoryReturn } from '../factories/user.factory';

describe.skip('emailtemplates', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userAllPerms: UserFactoryReturn;
  let userNoPerms: UserFactoryReturn;
  let recordRepo: Repository<Record>;
  let emailTemplateRepo: Repository<EmailTemplate>;
  let testRecord = null
  let testRecord1 = null

  jest.setTimeout(3000000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
    recordRepo = app.get(getRepositoryToken(Record))
    emailTemplateRepo = app.get(getRepositoryToken(EmailTemplate))
    userAllPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions(
        [
          'EmailTemplateCreateOne',
          'EmailTemplateCreateMany',
          'EmailTemplateUpdateOne',
          'EmailTemplateReplaceOne',
          UPLOAD_RECORD,
          SEND_EMAIL_TEMPLATE,
          'RecordGetMany',
          'RecordGetOne'
        ]
      )
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .addPermissions([])
      .create()


      try {

    testRecord = await recordRepo.save({
      fileName: 'test',
      fileUrl: 'test',
      fileType: 'test',
      ownerModel: userNoPerms.user,
      organisationModel: userAllPerms.organisation
    })
    testRecord1 = await recordRepo.save({
      fileName: 'test',
      fileUrl: 'test',
      fileType: 'test',
      ownerModel: userNoPerms.user,
      organisationModel: userAllPerms.organisation
    })
      } catch (err) {
        console.log(err)
      }
  })
  afterAll(async () => {
    await down(app);
  })

  it('createWithExistingRecords', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
        attachments: [
          testRecord.id,
          testRecord1.id
        ]
      })
      .expect(201)

    expect(ret.body.attachments.length).toBe(2)
  })
  it('updateRemoveAttachment', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
        attachments: [
          testRecord.id,
          testRecord1.id
        ]
      })
      .expect(201)

    expect(ret.body.attachments.length).toBe(2)
    let ret2 = await request(app.getHttpServer())
      .delete(`/emailtemplate/${ret.body.id}/attachments/${ret.body.attachments[0].id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .expect(200)
    expect(ret2.body.affected).toBe(1)

    let test = await emailTemplateRepo.findOne(ret.body.id)
    expect(test.attachments.length).toBe(1)
  })
  it('createWithExistingRecordsAndFiles', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
        attachments: [
          testRecord.id,
          testRecord1.id
        ]
      })
      .expect(201)

    let ret2 = await request(app.getHttpServer())
      .patch(`/emailtemplate/${ret.body.id}/attachments`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('files', `./test/e2e/fixtures/test.jpeg`)
      .attach('files', `./test/e2e/fixtures/test1.jpeg`)
      .expect(200)

    expect(ret2.body.attachments.length).toBe(4)
  })
  it('createWithExistingRecordsAndFiles', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
        attachments: [
          testRecord.id,
          testRecord1.id
        ]
      })
      .expect(201)

    let ret2 = await request(app.getHttpServer())
      .put(`/emailtemplate/${ret.body.id}/attachments`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('files', `./test/e2e/fixtures/test.jpeg`)
      .expect(200)

    expect(ret2.body.attachments.length).toBe(1)
  })

  it('sendEmailTemplate', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
      })
      .expect(201)

    await request(app.getHttpServer())
      .post(`/emailtemplate/send/${ret.body.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        context: {
          to: 'alex.taylor@appt.digital'
        }
      })
      .expect(201)
  })
  it('sendEmailTemplateWithAttachments', async () => {
    let ret = await request(app.getHttpServer())
      .post(`/emailtemplate`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        fromAddress: 'alex.taylor@appt.digital',
        subject: 'Email Template E2E Test',
        template: 'knights/generic.ejs',
        content: 'Hello this is a test',
        title: 'hello',
        active: true,
      })
      .expect(201)

    // Attach some files
    await request(app.getHttpServer())
      .patch(`/emailtemplate/${ret.body.id}/attachments`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .attach('files', `./test/e2e/fixtures/test.jpeg`)
      .attach('files', `./test/e2e/fixtures/test1.jpeg`)
      .expect(200)

    await request(app.getHttpServer())
      .post(`/emailtemplate/send/${ret.body.id}`)
      .set('Authorization', userAllPerms.apiToken)
      .query({
        orgId: userAllPerms.organisation.id,
        siteId: null
      })
      .send({
        context: {
          to: 'alex.taylor@appt.digital'
        }
      })
      .expect(201)
  })

});
