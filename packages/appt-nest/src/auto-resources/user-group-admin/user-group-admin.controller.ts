import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { Usergroupadmin, UsergroupadminDTO } from './user-group-admin.entity';
import { UsergroupadminService } from './user-group-admin.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Usergroupadmin,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: UsergroupadminDTO,
    create: UsergroupadminDTO,
    replace: UsergroupadminDTO,
  },
  ...defaultCrudPermissions('Usergroupadmin'),
})
@ApiTags('usergroupadmin')
@Controller('usergroupadmin')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class UsergroupadminController
  implements CrudController<Usergroupadmin>
{
  constructor(public service: UsergroupadminService) {}
}
