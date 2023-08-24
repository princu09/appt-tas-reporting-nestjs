import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Formsubmission } from './form-submission.entity';

@Injectable()
export class FormsubmissionService extends TypeOrmCrudService<Formsubmission> {
  constructor(@InjectRepository(Formsubmission) repo) {
    super(repo);
  }
}
