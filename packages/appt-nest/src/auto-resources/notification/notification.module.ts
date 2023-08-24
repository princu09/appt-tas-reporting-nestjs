import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/services/email/email.service';
import { PushService } from 'src/services/push/push.service';
import { SmsService } from 'src/services/sms/sms.service';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UserDeviceTokenModule } from '../user-device-token/user-device-token.module';
import { NotificationController } from './notification.controller';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, EmailService, PushService, SmsService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    PermissionsModule,
    NotificationModule,
    UserDeviceTokenModule,
  ],
})
export class NotificationModule {}
