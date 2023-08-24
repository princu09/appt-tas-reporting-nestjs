import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MessagingMessage } from './messaging-message.entity';

@Injectable()
export class MessagingMessageService extends TypeOrmCrudService<MessagingMessage> {
  constructor(@InjectRepository(MessagingMessage) repo) {
    super(repo);
  }

  getRepo() {
    return this.repo;
  }
}
