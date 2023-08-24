import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usernotification } from './user-notification.entity';

@Injectable()
export class UsernotificationService extends TypeOrmCrudService<Usernotification> {
  constructor(@InjectRepository(Usernotification) repo) {
    super(repo);
  }
}
