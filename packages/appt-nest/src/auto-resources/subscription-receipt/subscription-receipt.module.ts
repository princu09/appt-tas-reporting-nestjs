import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { SubscriptionreceiptController } from './subscription-receipt.controller';
import { SubscriptionreceiptService } from './subscription-receipt.service';
import { Subscriptionreceipt } from './subscription-receipt.entity';

@Module({
  controllers: [SubscriptionreceiptController],
  providers: [SubscriptionreceiptService],
  imports: [TypeOrmModule.forFeature([Subscriptionreceipt]), PermissionsModule],
})
export class SubscriptionreceiptModule {}
