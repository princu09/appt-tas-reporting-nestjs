import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Calendarevent } from './calendar-event.entity';

@Injectable()
export class CalendareventService extends TypeOrmCrudService<Calendarevent> {
  constructor(@InjectRepository(Calendarevent) repo) {
    super(repo);
  }
}
