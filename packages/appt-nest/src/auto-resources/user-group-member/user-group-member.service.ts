import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usergroupmember } from './user-group-member.entity';

@Injectable()
export class UsergroupmemberService extends TypeOrmCrudService<Usergroupmember> {
  constructor(@InjectRepository(Usergroupmember) repo) {
    super(repo);
  }
}
