import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingMessageController } from './messaging-message.controller';
import { MessagingMessageService } from './messaging-message.service';
import { MessagingMessage } from './messaging-message.entity';
import { PermissionsModule } from 'src/services/permissions/permissions.module';

@Module({
  controllers: [MessagingMessageController],
  providers: [MessagingMessageService],
  exports: [MessagingMessageService],
  imports: [TypeOrmModule.forFeature([MessagingMessage]), PermissionsModule],
})
export class MessagingMessageModule {}
