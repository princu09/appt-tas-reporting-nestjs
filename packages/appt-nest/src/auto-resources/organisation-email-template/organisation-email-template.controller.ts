import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  OrganisationEmailTemplate,
  OrganisationEmailTemplateDTO,
} from './organisation-email-template.entity';
import { OrganisationEmailTemplateService } from './organisation-email-template.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: OrganisationEmailTemplate,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationEmailTemplateDTO,
    create: OrganisationEmailTemplateDTO,
    replace: OrganisationEmailTemplateDTO,
  },
  ...defaultCrudPermissions('OrganisationEmailTemplate'),
})
@ApiTags('organisationemailtemplate')
@Controller('organisationemailtemplate')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationEmailTemplateController
  implements CrudController<OrganisationEmailTemplate>
{
  constructor(public service: OrganisationEmailTemplateService) {}
}
