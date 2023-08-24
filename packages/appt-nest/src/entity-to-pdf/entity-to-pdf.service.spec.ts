import { Test, TestingModule } from '@nestjs/testing';
import { EntityToPdfService } from './entity-to-pdf.service';

describe.skip('EntityToPdfService', () => {
  let service: EntityToPdfService;
  const object = {
    test: '1',
    test2: 3,
    test3: {
      test1: '1',
      test: {
        test: 3,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityToPdfService],
    }).compile();
    process.env.TMP_FILE_PATH = './';
    service = module.get<EntityToPdfService>(EntityToPdfService);
  });

  it('convert object', async () => {
    const tmp = await service.convert(object, 'tester', 'afile.pdf');
    expect(tmp).toBe('afile.pdf');
  });
  it('convert object with convert', async () => {
    const tmp = await service.convert(object, 'tester', 'afile1.pdf', () => {
      return { test: 1 };
    });
    expect(tmp).toBe('afile1.pdf');
  });
  it('convert string', async () => {
    const tmp = await service.convertStringify(object, 'tester', 'afile2.pdf');
    expect(tmp).toBe('afile2.pdf');
  });
});
