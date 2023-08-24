import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Organisationtag } from './organisation-tag.entity';

@Injectable()
export class OrganisationtagService extends TypeOrmCrudService<Organisationtag> {
  constructor(@InjectRepository(Organisationtag) repo) {
    super(repo);
  }
}
