import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { IsUUID, Min } from 'class-validator';
import { Response } from 'express';
import { defaultCrudPermissionNoRoute } from 'src/auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { ChunkUpload } from './chunk-upload.entity';
import { ChunkUploadService } from './chunk-upload.service';

class ChunkUploadDTO {
  @IsUUID()
  id: string;

  @Min(1)
  partNumber: number;
}

class UploadChunkUploadDTO {
  @IsUUID()
  owner: string;
}

@Crud({
  model: {
    type: ChunkUpload,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
    partNumber: {},
  },
  dto: {
    update: UploadChunkUploadDTO,
    create: ChunkUploadDTO,
  },
  routes: {
    only: ['getOneBase', 'getManyBase', 'updateOneBase'],
    ...defaultCrudPermissionNoRoute('chunkupload'),
  },
})
@ApiTags('chunk-upload')
@Controller('chunk-upload')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class ChunkUploadController implements CrudController<ChunkUpload> {
  constructor(public readonly service: ChunkUploadService) {}

  async getManyBase(
    req: CrudRequest,
  ): Promise<GetManyDefaultResponse<ChunkUpload> | ChunkUpload[]> {
    const ret = await this.service.getMany(req);

    if ((ret as GetManyDefaultResponse<ChunkUpload>).count) {
      for (const chunk of (ret as GetManyDefaultResponse<ChunkUpload>).data) {
        await this.service.signUrl(chunk);
      }
    } else {
      for (const chunk of ret as ChunkUpload[]) {
        await this.service.signUrl(chunk);
      }
    }

    return ret;
  }

  async getOneBase(req: CrudRequest): Promise<ChunkUpload> {
    const ret = await this.service.getOne(req);
    await this.service.signUrl(ret);
    return ret;
  }
}

@ApiTags('chunk-upload')
@Controller('chunk-upload')
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class ChunkUploadCreateController
  implements CrudController<ChunkUpload>
{
  constructor(public readonly service: ChunkUploadService) {}

  @Post('chunk/:id/:partNumber')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`chunkuploadCreateOne`])
  chunk(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Param('partNumber') partNumber: number,
  ) {
    return this.service.chunkUpload(id, partNumber, file);
  }

  @Post('start')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`chunkuploadCreateOne`])
  create(
    @Res({ passthrough: true }) res: Response,
    @Body('filename') filename: string,
  ) {
    return this.service.start(filename, res);
  }

  @Get('finish/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`chunkuploadCreateOne`])
  finish(@Param('id') id: string) {
    return this.service.finish(id);
  }
}
