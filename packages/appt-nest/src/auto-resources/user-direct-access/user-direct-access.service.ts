import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Userdirectaccess } from './user-direct-access.entity';

@Injectable()
export class UserdirectaccessService extends TypeOrmCrudService<Userdirectaccess> {
  constructor(@InjectRepository(Userdirectaccess) repo) {
    super(repo);
  }
}
