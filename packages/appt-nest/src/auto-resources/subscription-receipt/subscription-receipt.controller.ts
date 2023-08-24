import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  Subscriptionreceipt,
  SubscriptionreceiptDTO,
} from './subscription-receipt.entity';
import { SubscriptionreceiptService } from './subscription-receipt.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Subscriptionreceipt,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: SubscriptionreceiptDTO,
    create: SubscriptionreceiptDTO,
    replace: SubscriptionreceiptDTO,
  },
  ...defaultCrudPermissions('Subscriptionreceipt'),
})
@ApiTags('subscriptionreceipt')
@Controller('subscriptionreceipt')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class SubscriptionreceiptController
  implements CrudController<Subscriptionreceipt>
{
  constructor(public service: SubscriptionreceiptService) {}
}
