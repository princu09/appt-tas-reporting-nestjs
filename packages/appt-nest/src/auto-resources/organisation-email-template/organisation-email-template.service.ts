import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrganisationEmailTemplate } from './organisation-email-template.entity';

@Injectable()
export class OrganisationEmailTemplateService extends TypeOrmCrudService<OrganisationEmailTemplate> {
  constructor(@InjectRepository(OrganisationEmailTemplate) repo) {
    super(repo);
  }
}
