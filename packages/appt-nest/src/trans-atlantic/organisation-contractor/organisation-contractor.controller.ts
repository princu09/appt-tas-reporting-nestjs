import {
  Body,
  Controller,
  Param,
  Post,
  Res,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { Response } from 'express';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import {
  OrganisationContractor,
  OrganisationContractorAssignDTO,
  OrganisationContractorDTO,
} from './organisation-contractor.entity';
import { OrganisationContractorService } from './organisation-contractor.service';

@Crud({
  model: {
    type: OrganisationContractor,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationContractorDTO,
    create: OrganisationContractorDTO,
    replace: OrganisationContractorDTO,
  },
  ...defaultCrudPermissions('OrganisationContractor'),
})
@ApiTags('organisationcontractor')
@Controller('organisationcontractor')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationContractorController
  implements CrudController<OrganisationContractor>
{
  constructor(public service: OrganisationContractorService) {}

  @Post('/assign/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`OrganisationContractorAssign`])
  @ApiOperation({
    summary: `This will assign a user to the passed in organisation contractor id.
  The user and organisation contractor must all be part of the orgId that is passed in.
  You can only be assigned to one contractor per organisation so this end point will handle that, no need to unassign the old one.`,
  })
  assign(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: OrganisationContractorAssignDTO,
    @Param('id') id: string,
  ) {
    return this.service.assignUser(res, dto, id);
  }
}
