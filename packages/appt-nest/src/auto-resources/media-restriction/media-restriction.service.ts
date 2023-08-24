import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaRestriction } from './media-restriction.entity';

@Injectable()
export class MediaRestrictionService extends TypeOrmCrudService<MediaRestriction> {
  constructor(@InjectRepository(MediaRestriction) repo) {
    super(repo);
  }
}
