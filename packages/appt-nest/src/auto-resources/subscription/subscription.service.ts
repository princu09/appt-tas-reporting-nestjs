import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService extends TypeOrmCrudService<Subscription> {
  constructor(@InjectRepository(Subscription) repo) {
    super(repo);
  }
}
