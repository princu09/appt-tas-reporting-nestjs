import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { Organisationtag, OrganisationtagDTO } from './organisation-tag.entity';
import { OrganisationtagService } from './organisation-tag.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Organisationtag,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationtagDTO,
    create: OrganisationtagDTO,
    replace: OrganisationtagDTO,
  },
  ...defaultCrudPermissions('Organisationtag'),
})
@ApiTags('organisationtag')
@Controller('organisationtag')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationtagController
  implements CrudController<Organisationtag>
{
  constructor(public service: OrganisationtagService) {}
}
