import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { TestAutoApi } from './test-auto-api.entity';

@Injectable()
export class TestAutoApiService extends TypeOrmCrudService<TestAutoApi> {
  constructor(@InjectRepository(TestAutoApi) repo) {
    super(repo);
  }
}
