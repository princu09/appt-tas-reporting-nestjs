import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrganisationUserPurchases } from './organisation-user-purchases.entity';

@Injectable()
export class OrganisationUserPurchasesService extends TypeOrmCrudService<OrganisationUserPurchases> {
  constructor(@InjectRepository(OrganisationUserPurchases) repo) {
    super(repo);
  }
}
