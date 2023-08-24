import { Test, TestingModule } from '@nestjs/testing';
import { Max } from 'class-validator';
import { ApptBaseEntity } from 'src/base/appt-base-entity';
import { CsvToEntityService } from './csv-to-entity.service';

class CsvConvertTest extends ApptBaseEntity {
  test1: string;
  test2: string;
  @Max(10)
  test3: number;
}

class CsvConvertTestDto extends ApptBaseEntity {
  test1: string;
  test2: string;
  @Max(10)
  test3: number;
}

describe('CsvToEntityService', () => {
  let service: CsvToEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvToEntityService],
    }).compile();

    service = module.get<CsvToEntityService>(CsvToEntityService);
  });

  it('convertTest', async () => {
    const ret = await service.convert<CsvConvertTest, CsvConvertTestDto>(
      `test1, test2, test3
hello, hello, 3
hello, 123, 13
hello, hello, 3
hello, hello, 13
hello, hello, 3
hello, test, 3`,
      CsvConvertTestDto,
      {
        organisation: '1',
        site: '1',
        owner: '1',
      },
    );

    expect(ret.errors.length).toBe(2);
    expect(ret.objects.length).toBe(4);
  });
});
