import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  OrganisationContract,
  OrganisationContractDTO,
} from './organisation-contract.entity';
import { OrganisationContractService } from './organisation-contract.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: OrganisationContract,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationContractDTO,
    create: OrganisationContractDTO,
    replace: OrganisationContractDTO,
  },
  ...defaultCrudPermissions('OrganisationContract'),
})
@ApiTags('organisationcontract')
@Controller('organisationcontract')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationContractController
  implements CrudController<OrganisationContract>
{
  constructor(public service: OrganisationContractService) {}
}
