import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usergroupadmin } from './user-group-admin.entity';

@Injectable()
export class UsergroupadminService extends TypeOrmCrudService<Usergroupadmin> {
  constructor(@InjectRepository(Usergroupadmin) repo) {
    super(repo);
  }
}
