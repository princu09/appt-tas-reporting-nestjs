import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './subscription.entity';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [TypeOrmModule.forFeature([Subscription]), PermissionsModule],
})
export class SubscriptionModule {}
