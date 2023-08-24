import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { Formsubmission, FormsubmissionDTO } from './form-submission.entity';
import { FormsubmissionService } from './form-submission.service';

@Crud({
  model: {
    type: Formsubmission,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      responses: {
        eager: true,
      },
    },
  },
  dto: {
    update: FormsubmissionDTO,
    create: FormsubmissionDTO,
    replace: FormsubmissionDTO,
  },
  ...defaultCrudPermissions('Formsubmission'),
})
@ApiTags('formsubmission')
@Controller('formsubmission')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class FormsubmissionController
  implements CrudController<Formsubmission>
{
  constructor(public service: FormsubmissionService) {}
}
