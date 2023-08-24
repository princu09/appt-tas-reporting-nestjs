import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  Organisationsystemtag,
  OrganisationsystemtagDTO,
} from './organisation-system-tag.entity';
import { OrganisationsystemtagService } from './organisation-system-tag.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Organisationsystemtag,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationsystemtagDTO,
    create: OrganisationsystemtagDTO,
    replace: OrganisationsystemtagDTO,
  },
  ...defaultCrudPermissions('Organisationsystemtag'),
})
@ApiTags('organisationsystemtag')
@Controller('organisationsystemtag')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationsystemtagController
  implements CrudController<Organisationsystemtag>
{
  constructor(public service: OrganisationsystemtagService) {}
}
