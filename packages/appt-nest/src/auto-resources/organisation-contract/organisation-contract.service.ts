import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrganisationContract } from './organisation-contract.entity';

@Injectable()
export class OrganisationContractService extends TypeOrmCrudService<OrganisationContract> {
  constructor(@InjectRepository(OrganisationContract) repo) {
    super(repo);
  }
}
