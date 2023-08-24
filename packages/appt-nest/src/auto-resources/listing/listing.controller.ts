import {
  Controller,
  Post,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { Response } from 'express';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { Listing, ListingDTO } from './listing.entity';
import { ListingService } from './listing.service';

@Crud({
  model: {
    type: Listing,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: ListingDTO,
    create: ListingDTO,
    replace: ListingDTO,
  },
  ...defaultCrudPermissions('Listing'),
})
@ApiTags('listing')
@Controller('listing')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class ListingController implements CrudController<Listing> {
  constructor(public service: ListingService) {}

  @Post('/csv')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`ListingCreateMany`])
  uploadFile(
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadFile(res, file);
  }
}
