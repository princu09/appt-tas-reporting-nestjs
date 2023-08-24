import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import {
  MediaRestriction,
  MediaRestrictionDTO,
} from './media-restriction.entity';
import { MediaRestrictionService } from './media-restriction.service';

@Crud({
  model: {
    type: MediaRestriction,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: MediaRestrictionDTO,
    create: MediaRestrictionDTO,
    replace: MediaRestrictionDTO,
  },
  ...defaultCrudPermissions('MediaRestriction'),
})
@ApiTags('media-restriction')
@Controller('media-restriction')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class MediaRestrictionController
  implements CrudController<MediaRestriction>
{
  constructor(public service: MediaRestrictionService) {}
}
