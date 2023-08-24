import { INestApplication } from '@nestjs/common';
import { readFileSync } from 'fs';
import { AwsService } from 'src/services/aws/aws.service';
import { down, up } from './e2eHelpers';

describe.skip('awsTest', () => {
  let app: INestApplication;
  let aws: AwsService;

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app } = await up())
    aws = app.get(AwsService)
  })
  afterAll(async () => {
    await down(app);
  })

  it('uploadTest', async () => {
    const file = readFileSync('./test/e2e/fixtures/test.jpeg')
    const ret = await aws.uploadS3(file, 'test.jpeg')
    expect(ret.Location)
    expect(ret.Key).toBe('test.jpeg')
  })
  it('uploadDownloadTest', async () => {
    const file = readFileSync('./test/e2e/fixtures/test.jpeg')
    const ret = await aws.uploadS3(file, 'test.jpeg')
    const buffer = await aws.getFileBuffer(ret.Location)
    expect(buffer)
  })
});
