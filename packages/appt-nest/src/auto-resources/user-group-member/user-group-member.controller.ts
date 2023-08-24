import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  Usergroupmember,
  UsergroupmemberDTO,
} from './user-group-member.entity';
import { UsergroupmemberService } from './user-group-member.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Usergroupmember,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: UsergroupmemberDTO,
    create: UsergroupmemberDTO,
    replace: UsergroupmemberDTO,
  },
  ...defaultCrudPermissions('Usergroupmember'),
})
@ApiTags('usergroupmember')
@Controller('usergroupmember')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class UsergroupmemberController
  implements CrudController<Usergroupmember>
{
  constructor(public service: UsergroupmemberService) {}
}
