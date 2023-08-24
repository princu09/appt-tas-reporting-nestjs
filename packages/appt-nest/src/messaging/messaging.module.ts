import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MessagingConversationModule } from 'src/auto-resources/messaging/messaging-conversation/messaging-conversation.module';
import { MessagingMessageModule } from 'src/auto-resources/messaging/messaging-message/messaging-message.module';
import { OrganisationModule } from 'src/auto-resources/organisation/organisation.module';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { SiteModule } from 'src/auto-resources/site/site.module';
import { UserModule } from 'src/auto-resources/user/user.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './messaging.service';

@Module({
  providers: [MessagingGateway, MessagingService],
  imports: [
    TypeOrmModule.forFeature([Roleuser]),
    PermissionsModule,
    MessagingConversationModule,
    MessagingMessageModule,
    AuthenticationModule,
    OrganisationModule,
    SiteModule,
    UserModule,
  ],
})
export class MessagingModule {}
