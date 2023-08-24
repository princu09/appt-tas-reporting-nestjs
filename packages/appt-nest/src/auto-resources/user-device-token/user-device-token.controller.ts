import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import {
  UserDeviceToken,
  UserDeviceTokenDTO,
} from './user-device-token.entity';
import { UserDeviceTokenService } from './user-device-token.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: UserDeviceToken,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: UserDeviceTokenDTO,
    create: UserDeviceTokenDTO,
    replace: UserDeviceTokenDTO,
  },
  ...defaultCrudPermissions('UserDeviceToken'),
})
@ApiTags('userdevicetoken')
@Controller('userdevicetoken')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class UserDeviceTokenController
  implements CrudController<UserDeviceToken>
{
  constructor(public service: UserDeviceTokenService) {}
}
