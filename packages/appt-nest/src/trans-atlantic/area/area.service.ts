import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Area } from './area.entity';

@Injectable()
export class AreaService extends TypeOrmCrudService<Area> {
  constructor(@InjectRepository(Area) repo) {
    super(repo);
  }
}
