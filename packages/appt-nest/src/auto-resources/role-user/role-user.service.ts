import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Roleuser } from './role-user.entity';

@Injectable()
export class RoleuserService extends TypeOrmCrudService<Roleuser> {
  constructor(@InjectRepository(Roleuser) repo) {
    super(repo);
  }
}
