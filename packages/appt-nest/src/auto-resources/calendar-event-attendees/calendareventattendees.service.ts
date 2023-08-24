import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Calendareventattendees } from './calendareventattendees.entity';

@Injectable()
export class CalendareventattendeesService extends TypeOrmCrudService<Calendareventattendees> {
  constructor(@InjectRepository(Calendareventattendees) repo) {
    super(repo);
  }
}
