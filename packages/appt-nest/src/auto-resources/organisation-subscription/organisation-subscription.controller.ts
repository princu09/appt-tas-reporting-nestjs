import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  Organisationsubscription,
  OrganisationsubscriptionDTO,
} from './organisation-subscription.entity';
import { OrganisationsubscriptionService } from './organisation-subscription.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Organisationsubscription,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationsubscriptionDTO,
    create: OrganisationsubscriptionDTO,
    replace: OrganisationsubscriptionDTO,
  },
  ...defaultCrudPermissions('Organisationsubscription'),
})
@ApiTags('organisationsubscription')
@Controller('organisationsubscription')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationsubscriptionController
  implements CrudController<Organisationsubscription>
{
  constructor(public service: OrganisationsubscriptionService) {}
}
