import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { EmailService } from 'src/services/email/email.service';
import { PushService } from 'src/services/push/push.service';
import { SmsService } from 'src/services/sms/sms.service';
import { Repository } from 'typeorm';
import { Organisation } from '../organisation/organisation.entity';
import { UserDeviceTokenService } from '../user-device-token/user-device-token.service';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from './notification.entity';

@Injectable()
export class NotificationService extends TypeOrmCrudService<Notification> {
  constructor(
    @InjectRepository(Notification) repo: Repository<Notification>,
    private udtRepo: UserDeviceTokenService,
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushService,
  ) {
    super(repo);
  }

  async sendNotification(notification: Notification) {
    switch (notification.type) {
      case NotificationType.email:
        await this.sendEmailNotification(notification);
        break;
      case NotificationType.sms:
        await this.sendSMSNotification(notification);
        break;
      case NotificationType.push:
        await this.sendPushNotification(notification);
        break;
      default:
        notification.status = NotificationStatus.failed;
        await this.repo.save(notification);
        break;
    }
  }

  async sendEmailNotification(notification: Notification) {
    if (notification.targetUser.email) {
      const ret = await this.emailService.sendOrganisationEmail(
        notification.organisationModel as Organisation,
        {
          to: notification.targetUser.email,
          from: notification.from,
          subject: notification.subject,
          content: notification.body,
          title: notification.subject,
          attachments: [],
          template: notification.template,
          data: notification.data,
        },
      );

      if (ret.length && ret[0].statusCode === 202) {
        notification.status = NotificationStatus.sent;
      } else {
        notification.status = NotificationStatus.failed;
      }

      await this.repo.save(notification);
    } else {
      notification.status = NotificationStatus.failed;
      await this.repo.save(notification);
    }
  }

  async sendSMSNotification(notification: Notification) {
    // Check for correct details
    if (
      !notification.targetUser.mobile ||
      !notification.body ||
      !notification.from
    ) {
      notification.status = NotificationStatus.failed;
      await this.repo.save(notification);
      return;
    }

    // Send message
    if (
      await this.smsService.sendSMS({
        body: notification.body,
        from: notification.from,
        to: notification.targetUser.mobile.trim(),
      })
    ) {
      notification.status = NotificationStatus.sent;
    } else {
      notification.status = NotificationStatus.failed;
    }

    // Save the notifcation with new status
    await this.repo.save(notification);
  }

  async createAndSend(notification: Notification) {
    return await this.sendNotification(notification);
  }

  async sendPushNotification(notification: Notification) {
    // Find user device tokens
    const tokens = await this.udtRepo.find({
      owner: notification.targetUserId,
      organisation: notification.organisation,
      site: notification.site,
    });

    if (!tokens) {
      notification.status = NotificationStatus.failed;
      await this.repo.save(notification);
    } else {
      const ret = await this.pushService.sendNotification(
        tokens.map((x) => x.deviceToken),
        notification.data,
        {
          title: notification.subject,
          body: notification.body,
        },
      );

      if (ret.length && ret[0].successCount) {
        notification.status = NotificationStatus.sent;
      } else {
        notification.status = NotificationStatus.failed;
      }
      await this.repo.save(notification);
    }
  }
}
