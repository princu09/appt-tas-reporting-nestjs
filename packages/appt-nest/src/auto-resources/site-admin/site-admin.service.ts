import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Siteadmin } from './site-admin.entity';

@Injectable()
export class SiteadminService extends TypeOrmCrudService<Siteadmin> {
  constructor(@InjectRepository(Siteadmin) repo) {
    super(repo);
  }
}
