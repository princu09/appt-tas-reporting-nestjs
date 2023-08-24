import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Organisationsubscription } from './organisation-subscription.entity';

@Injectable()
export class OrganisationsubscriptionService extends TypeOrmCrudService<Organisationsubscription> {
  constructor(@InjectRepository(Organisationsubscription) repo) {
    super(repo);
  }
}
