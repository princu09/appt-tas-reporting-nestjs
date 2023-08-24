import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from 'src/auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import {
  MessagingMessage,
  MessagingMessageDTO,
} from './messaging-message.entity';
import { MessagingMessageService } from './messaging-message.service';

@Crud({
  model: {
    type: MessagingMessage,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: MessagingMessageDTO,
    create: MessagingMessageDTO,
    replace: MessagingMessageDTO,
  },
  ...defaultCrudPermissions('MessagingMessage'),
})
@ApiTags('messagingmessage')
@Controller('messagingmessage')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class MessagingMessageController
  implements CrudController<MessagingMessage>
{
  constructor(public service: MessagingMessageService) {}
}
