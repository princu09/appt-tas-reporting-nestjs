import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Audittrail } from './audit-trail.entity';

@Injectable()
export class AudittrailService extends TypeOrmCrudService<Audittrail> {
  constructor(@InjectRepository(Audittrail) repo) {
    super(repo);
  }
}
