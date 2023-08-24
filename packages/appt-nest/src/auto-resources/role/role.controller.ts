import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissionNoRoute } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { Role, RoleDTO } from './role.entity';
import { RoleService } from './role.service';

@Crud({
  model: {
    type: Role,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: RoleDTO,
    create: RoleDTO,
    replace: RoleDTO,
  },
  routes: {
    ...defaultCrudPermissionNoRoute('Role'),
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('role')
@Controller('role')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}
}
