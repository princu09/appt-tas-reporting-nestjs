import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async sendNotification(
    regIds: string[],
    data: { [key: string]: string },
    notification: any,
  ) {
    try {
      // Recommended we dont send any more that 500 messages in 1 go
      const regIdPackets = _.chunk(regIds, 500);
      let returnPackets: admin.messaging.BatchResponse[] = [];
      for (const packet of regIdPackets) {
        // create message packet
        const message = {
          ...(data && { data: data }),
          ...(notification && { notification: notification }),
          tokens: packet,
        };

        // store the results
        returnPackets = _.concat(
          returnPackets,
          await admin.messaging().sendMulticast(message),
        );
      }
      return returnPackets;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      return null;
    }
  }
}
