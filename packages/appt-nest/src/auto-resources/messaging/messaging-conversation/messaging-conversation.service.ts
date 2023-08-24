import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { MessagingConversation } from './messaging-conversation.entity';

@Injectable()
export class MessagingConversationService extends TypeOrmCrudService<MessagingConversation> {
  constructor(
    @InjectRepository(MessagingConversation)
    repo: Repository<MessagingConversation>,
  ) {
    super(repo);
  }

  getRepo() {
    return this.repo;
  }

  async addUser(userId: string, conversationId: string) {
    return await this.repo
      .createQueryBuilder()
      .relation(MessagingConversation, 'chatters')
      .of({ id: conversationId })
      .add({ id: userId });
  }

  async removeUser(userId: string, conversationId: string) {
    return await this.repo.createQueryBuilder().relation('chatters').remove({
      userId: userId,
      converstionId: conversationId,
    });
  }
}
