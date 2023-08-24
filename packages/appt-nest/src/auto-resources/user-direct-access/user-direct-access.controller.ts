import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  Userdirectaccess,
  UserdirectaccessDTO,
} from './user-direct-access.entity';
import { UserdirectaccessService } from './user-direct-access.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Userdirectaccess,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: UserdirectaccessDTO,
    create: UserdirectaccessDTO,
    replace: UserdirectaccessDTO,
  },
  ...defaultCrudPermissions('Userdirectaccess'),
})
@ApiTags('userdirectaccess')
@Controller('userdirectaccess')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class UserdirectaccessController
  implements CrudController<Userdirectaccess>
{
  constructor(public service: UserdirectaccessService) {}
}
