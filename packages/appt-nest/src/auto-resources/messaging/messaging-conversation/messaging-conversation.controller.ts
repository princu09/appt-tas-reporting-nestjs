import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from 'src/auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import {
  MessagingConversation,
  MessagingConversationDTO,
} from './messaging-conversation.entity';
import { MessagingConversationService } from './messaging-conversation.service';

@Crud({
  model: {
    type: MessagingConversation,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: MessagingConversationDTO,
    create: MessagingConversationDTO,
    replace: MessagingConversationDTO,
  },
  ...defaultCrudPermissions('MessagingConversation'),
})
@ApiTags('messagingconversation')
@Controller('messagingconversation')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class MessagingConversationController
  implements CrudController<MessagingConversation>
{
  constructor(public service: MessagingConversationService) {}
}
