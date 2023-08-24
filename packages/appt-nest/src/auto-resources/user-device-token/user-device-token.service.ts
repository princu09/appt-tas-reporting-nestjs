import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserDeviceToken } from './user-device-token.entity';

@Injectable()
export class UserDeviceTokenService extends TypeOrmCrudService<UserDeviceToken> {
  constructor(@InjectRepository(UserDeviceToken) repo) {
    super(repo);
  }
}
