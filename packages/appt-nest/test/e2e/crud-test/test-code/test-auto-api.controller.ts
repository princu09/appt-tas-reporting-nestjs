import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from "@nestjsx/crud";
import { defaultCrudPermissions } from '../../../../src/auto-api/default-crud-permissions';
import { IsLoggedInGuard } from '../../../../src/guards/is-logged-in.guard';
import { HasOrganisationGuard } from '../../../../src/guards/has-organisation.guard';
import { HasSiteGuard } from '../../../../src/guards/has-site.guard';
import { TestAutoApi, TestAutoApiDTO } from './test-auto-api.entity';
import { TestAutoApiService } from './test-auto-api.service';
import { OrgSiteOwnerPermissionInterceptor } from '../../../../src/auto-api/org-site-owner-permission.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: TestAutoApi,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true
    }
  },
  dto: {
    update: TestAutoApiDTO,
    create: TestAutoApiDTO,
    replace: TestAutoApiDTO
  },
  ...defaultCrudPermissions('TestAutoApi')
})
@ApiTags('testautoapi')
@Controller('testautoapi')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class TestAutoApiController implements CrudController<TestAutoApi> {
  constructor(public service: TestAutoApiService) { }
}
