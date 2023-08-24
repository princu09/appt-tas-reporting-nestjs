import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { down, up } from './e2eHelpers';
import { UserFactory } from './factories/user.factory';

describe('ping', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())
  })
  afterAll(async () => {
    await down(app);
  })

  it('test', async () => {
    await request(app.getHttpServer())
      .get(`/ping`)
      .expect(200)
  })
});
