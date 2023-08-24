import {
  Controller,
  Post,
  Res,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { Record, RecordDTO } from './record.entity';
import { UPLOAD_RECORD } from './record.permissions';
import { RecordService } from './record.service';

@Crud({
  model: {
    type: Record,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: RecordDTO,
    create: RecordDTO,
    replace: RecordDTO,
  },
  routes: {
    ...defaultCrudPermissions('Record'),
    exclude: [
      'createManyBase',
      'createOneBase',
      'replaceOneBase',
      'updateOneBase',
      'recoverOneBase',
    ],
  },
})
@ApiTags('record')
@Controller('record')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class RecordController implements CrudController<Record> {
  constructor(public service: RecordService) {}

  @Post('/upload')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [UPLOAD_RECORD])
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(
    @Res({ passthrough: true }) res,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.service.uploadFiles(res, files);
  }

  @Override('getOneBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`RecordGetOne`])
  async getOne(@ParsedRequest() req: CrudRequest): Promise<Record> {
    const ret = await this.service.getOne(req);
    return this.service.signURL(ret);
  }

  @Override('getManyBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`RecordGetMany`])
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<Record> | Record[]> {
    let ret = await this.service.getMany(req);
    if (ret['data']) {
      ret = ret as GetManyDefaultResponse<Record>;
      for (let record of ret.data as Record[]) {
        record = await this.service.signURL(record);
      }
    } else {
      ret = ret as Record[];
      for (let record of ret) {
        record = await this.service.signURL(record);
      }
    }
    return ret;
  }
}
