import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Organisationsystemtag } from './organisation-system-tag.entity';

@Injectable()
export class OrganisationsystemtagService extends TypeOrmCrudService<Organisationsystemtag> {
  constructor(@InjectRepository(Organisationsystemtag) repo) {
    super(repo);
  }
}
