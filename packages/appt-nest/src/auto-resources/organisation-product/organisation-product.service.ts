import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { OrganisationProduct } from './organisation-product.entity';

@Injectable()
export class OrganisationProductService extends TypeOrmCrudService<OrganisationProduct> {
  constructor(@InjectRepository(OrganisationProduct) repo) {
    super(repo);
  }
}
