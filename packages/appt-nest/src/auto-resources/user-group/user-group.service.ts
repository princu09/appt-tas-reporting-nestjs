import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usergroup } from './user-group.entity';

@Injectable()
export class UsergroupService extends TypeOrmCrudService<Usergroup> {
  constructor(@InjectRepository(Usergroup) repo) {
    super(repo);
  }
}
