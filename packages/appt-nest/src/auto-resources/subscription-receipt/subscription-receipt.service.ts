import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Subscriptionreceipt } from './subscription-receipt.entity';

@Injectable()
export class SubscriptionreceiptService extends TypeOrmCrudService<Subscriptionreceipt> {
  constructor(@InjectRepository(Subscriptionreceipt) repo) {
    super(repo);
  }
}
