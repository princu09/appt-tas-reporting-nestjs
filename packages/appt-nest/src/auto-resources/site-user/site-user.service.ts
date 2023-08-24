import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Siteuser } from './site-user.entity';

@Injectable()
export class SiteuserService extends TypeOrmCrudService<Siteuser> {
  constructor(@InjectRepository(Siteuser) repo) {
    super(repo);
  }
}
