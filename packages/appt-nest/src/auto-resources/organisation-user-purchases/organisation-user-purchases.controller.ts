import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  OrganisationUserPurchases,
  OrganisationUserPurchasesDTO,
} from './organisation-user-purchases.entity';
import { OrganisationUserPurchasesService } from './organisation-user-purchases.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: OrganisationUserPurchases,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationUserPurchasesDTO,
    create: OrganisationUserPurchasesDTO,
    replace: OrganisationUserPurchasesDTO,
  },
  ...defaultCrudPermissions('OrganisationUserPurchases'),
})
@ApiTags('organisationuserpurchases')
@Controller('organisationuserpurchases')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationUserPurchasesController
  implements CrudController<OrganisationUserPurchases>
{
  constructor(public service: OrganisationUserPurchasesService) {}

  // TODO: Override the on create method to set the price
  // We will want to restruct the auto endpoints to just get more than likely
  // Workout how we will
  // Restrict the purchase to products that the user is in the organisation of
  // Make a purchase through
  // apple
  // android
  // stripe
  // know if we have receive it from apple, android
}
