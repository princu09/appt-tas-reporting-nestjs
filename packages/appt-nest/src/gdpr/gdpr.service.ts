import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendarevent } from 'src/auto-resources/calendar-event/calendar-event.entity';
import { EmailTemplate } from 'src/auto-resources/email-template/email-template.entity';
import { Formsubmission } from 'src/auto-resources/form-submission/form-submission.entity';
import { Listing } from 'src/auto-resources/listing/listing.entity';
import { Media } from 'src/auto-resources/media/media.entity';
import { MessagingConversation } from 'src/auto-resources/messaging/messaging-conversation/messaging-conversation.entity';
import { Notification } from 'src/auto-resources/notification/notification.entity';
import { Record } from 'src/auto-resources/record/record.entity';
import { Usernotification } from 'src/auto-resources/user-notification/user-notification.entity';
import { Usertag } from 'src/auto-resources/user-tag/user-tag.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { Metadata } from 'src/metadata/metadata.entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class GdprService {
  private readonly logger = new Logger(GdprService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getUserGDPR(id: string) {
    const returnData = {};
    if (!(await this.userRepo.count({ id: id })))
      throw new BadRequestException('User does not exist');

    // Iterate models
    for (const entity of getConnection().entityMetadatas) {
      try {
        const where = [];
        if (entity.name === 'User') continue;

        // Iterate the models relations
        for (const relation of entity.relations) {
          try {
            // Is it a user relation ? or is it many to many
            if (
              relation.inverseEntityMetadata.name !== 'User' ||
              relation.joinTableName
            )
              continue;
            const newWhere = {};
            newWhere[relation.joinColumns[0].propertyName] = id;
            where.push(newWhere);
          } catch (err) {
            this.logger.error(
              `Failed to get user GDPR for ${id} : ${entity} : ${relation}`,
            );
          }
        }

        if (where.length) {
          returnData[entity.name] = await getConnection()
            .getRepository(entity.target)
            .find({ where: where });
        }
      } catch (err) {
        this.logger.error(`Failed to get user GDPR for ${id} : ${entity}`);
      }
    }

    return returnData;
  }

  async deleteUserGDPR(id: string) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new BadRequestException('User does not exist');

    await getConnection().getRepository(Media).delete({ owner: id });
    await getConnection().getRepository(Calendarevent).delete({ owner: id });
    await getConnection().getRepository(Record).delete({ owner: id });
    await getConnection().getRepository(EmailTemplate).delete({ owner: id });
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Formsubmission)
      .where('owner = :id OR subject = :id', { id })
      .execute();
    await getConnection().getRepository(Listing).delete({ owner: id });
    await getConnection().getRepository(Media).delete({ owner: id });
    await getConnection()
      .getRepository(MessagingConversation)
      .delete({ owner: id });
    await getConnection().getRepository(Usertag).delete({ owner: id });
    await getConnection().getRepository(Metadata).delete({ owner: id });
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('owner = :id OR targetUserId = :id', { id })
      .execute();
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Usernotification)
      .where('owner = :id OR recipient = :id', { id })
      .execute();

    const blankuser = Object.assign(new User(), {
      email: `Deleted:${user.id}`,
      username: `Deleted:${user.id}`,
    });
    await this.userRepo.update(id, blankuser);
    await this.userRepo.softDelete(id);
  }
}
