import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { MessagingConversationController } from './messaging-conversation.controller';
import { MessagingConversation } from './messaging-conversation.entity';
import { MessagingConversationService } from './messaging-conversation.service';

@Module({
  controllers: [MessagingConversationController],
  providers: [MessagingConversationService],
  exports: [MessagingConversationService],
  imports: [
    TypeOrmModule.forFeature([MessagingConversation]),
    PermissionsModule,
  ],
})
export class MessagingConversationModule {}
