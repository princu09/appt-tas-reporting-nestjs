import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { Siteuser, SiteuserDTO } from './site-user.entity';
import { SiteuserService } from './site-user.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Siteuser,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: SiteuserDTO,
    create: SiteuserDTO,
    replace: SiteuserDTO,
  },
  ...defaultCrudPermissions('Siteuser'),
})
@ApiTags('siteuser')
@Controller('siteuser')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class SiteuserController implements CrudController<Siteuser> {
  constructor(public service: SiteuserService) {}
}
