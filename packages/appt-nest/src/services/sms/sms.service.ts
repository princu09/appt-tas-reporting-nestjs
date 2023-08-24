import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  client: Twilio;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.client = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
    }
  }
  async sendSMS(sms: MessageListInstanceCreateOptions) {
    try {
      sms.messagingServiceSid = process.env.TWILIO_MESSAGING_SID;
      this.logger.log(`Sending message: ${JSON.stringify(sms)}`);
      const message = await this.client.messages.create(sms);
      this.logger.log(`Message Send Response: ${JSON.stringify(message)}`);

      if (
        [
          'sent',
          'accepted',
          'delivered',
          'partially_delivered',
          'scheduled',
          'read',
          'sending',
        ].includes(message.status)
      )
        return true;
      return false;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
