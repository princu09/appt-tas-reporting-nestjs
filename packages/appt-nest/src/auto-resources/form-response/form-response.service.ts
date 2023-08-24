import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Formresponse } from './form-response.entity';

@Injectable()
export class FormresponseService extends TypeOrmCrudService<Formresponse> {
  constructor(@InjectRepository(Formresponse) repo) {
    super(repo);
  }
}
