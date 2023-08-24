import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrganisationCharge } from './organisation-charge.entity';

@Injectable()
export class OrganisationChargeService extends TypeOrmCrudService<OrganisationCharge> {
  constructor(@InjectRepository(OrganisationCharge) repo) {
    super(repo);
  }
}
