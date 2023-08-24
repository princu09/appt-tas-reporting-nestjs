import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import {
  Calendareventattendees,
  CalendareventattendeesDTO,
} from './calendareventattendees.entity';
import { CalendareventattendeesService } from './calendareventattendees.service';

@Crud({
  model: {
    type: Calendareventattendees,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: CalendareventattendeesDTO,
    create: CalendareventattendeesDTO,
    replace: CalendareventattendeesDTO,
  },
  ...defaultCrudPermissions('Calendareventattendees'),
})
@ApiTags('calendareventattendees')
@Controller('calendareventattendees')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class CalendareventattendeesController
  implements CrudController<Calendareventattendees>
{
  constructor(public service: CalendareventattendeesService) {}
}
