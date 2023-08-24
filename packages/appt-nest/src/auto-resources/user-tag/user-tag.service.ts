import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usertag } from './user-tag.entity';

@Injectable()
export class UsertagService extends TypeOrmCrudService<Usertag> {
  constructor(@InjectRepository(Usertag) repo) {
    super(repo);
  }
}
