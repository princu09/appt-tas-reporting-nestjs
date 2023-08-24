import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { defaultCrudPermissionNoRoute } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import {
  OrganisationProduct,
  OrganisationProductDTO,
} from './organisation-product.entity';
import { OrganisationProductService } from './organisation-product.service';

@Crud({
  model: {
    type: OrganisationProduct,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: OrganisationProductDTO,
    create: OrganisationProductDTO,
    replace: OrganisationProductDTO,
  },
  routes: {
    only: [
      'createManyBase',
      'createOneBase',
      'deleteOneBase',
      'recoverOneBase',
      'updateOneBase',
    ],
    ...defaultCrudPermissionNoRoute('OrganisationProduct'),
  },
})
@ApiTags('OrganisationProduct')
@Controller('OrganisationProduct')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class OrganisationProductController
  implements CrudController<OrganisationProduct>
{
  constructor(public service: OrganisationProductService) {}
}
