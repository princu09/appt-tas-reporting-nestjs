import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { RecordModule } from '../record/record.module';
import { Subscriptionreceipt } from '../subscription-receipt/subscription-receipt.entity';
import { MediaController } from './media.controller';
import { Media } from './media.entity';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    TypeOrmModule.forFeature([Media, Subscriptionreceipt]),
    PermissionsModule,
    RecordModule,
  ],
})
export class MediaModule {}
