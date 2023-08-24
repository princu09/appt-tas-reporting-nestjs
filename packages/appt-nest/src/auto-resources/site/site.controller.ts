import {
  Controller,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { UserHasPermissionGuard } from '../../guards/user-has-permission.guard';
import { SiteAutoInterceptor } from './site-auto.interceptor';
import { Site, SiteDTO } from './site.entity';
import { SiteService } from './site.service';

@Crud({
  model: {
    type: Site,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: SiteDTO,
    create: SiteDTO,
    replace: SiteDTO,
  },
  routes: {
    getManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteGetMany`]),
      ],
    },
    getOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteGetOne`]),
      ],
    },
    createOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteCreateOne`, `CreateSite`]),
      ],
    },
    createManyBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteCreateMany`, `CreateSite`]),
      ],
    },
    updateOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteUpdateOne`]),
      ],
    },
    replaceOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteReplaceOne`]),
      ],
    },
    deleteOneBase: {
      decorators: [
        UseGuards(UserHasPermissionGuard),
        SetMetadata('permissions', [`SiteDeleteOne`]),
      ],
    },
  },
})
@ApiTags('site')
@Controller('site')
@UseInterceptors(SiteAutoInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class SiteController implements CrudController<Site> {
  constructor(public service: SiteService) {}
}
