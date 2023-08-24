import {
  BadRequestException,
  Controller,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { defaultCrudPermissionNoRoute } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import {
  OrganisationCharge,
  OrganisationChargeDTO,
} from './organisation-charge.entity';
import { OrganisationChargeService } from './organisation-charge.service';

@Crud({
  model: {
    type: OrganisationCharge,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationChargeDTO,
    create: OrganisationChargeDTO,
    replace: OrganisationChargeDTO,
  },
  routes: {
    only: [
      'createManyBase',
      'createOneBase',
      'deleteOneBase',
      'getManyBase',
      'getOneBase',
    ],
    ...defaultCrudPermissionNoRoute('OrganisationCharge'),
  },
})
@ApiTags('organisationcharge')
@Controller('organisationcharge')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationChargeController
  implements CrudController<OrganisationCharge>
{
  constructor(public service: OrganisationChargeService) {}

  @Override('deleteOneBase')
  async deleteOne(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
  ): Promise<void | OrganisationCharge> {
    const charge = await this.service.findOne(id);
    if (charge.processed)
      throw new BadRequestException('You cannot delete a processed charge.');
    return this.service.deleteOne(req);
  }
}
