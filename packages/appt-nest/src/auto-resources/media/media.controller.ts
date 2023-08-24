import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Param,
  Post,
  Res,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Response } from 'express';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { getManager } from 'typeorm';
import { defaultCrudPermissions } from '../../auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from '../../auto-api/org-site-owner-permission.interceptor';
import { HasOrganisationGuard } from '../../guards/has-organisation.guard';
import { HasSiteGuard } from '../../guards/has-site.guard';
import { IsLoggedInGuard } from '../../guards/is-logged-in.guard';
import { RecordCreateStats, RecordService } from '../record/record.service';
import { Media, MediaDTO } from './media.entity';
import { MediaService } from './media.service';

@Crud({
  model: {
    type: Media,
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
      parent: {
        eager: true,
      },
      record: {
        eager: true,
      },
      mediaRestriction: {
        eager: true,
      },
    },
  },
  dto: {
    update: MediaDTO,
    create: MediaDTO,
    replace: MediaDTO,
  },
  ...defaultCrudPermissions('media'),
})
@ApiTags('media')
@Controller('media')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class MediaController implements CrudController<Media> {
  constructor(
    public service: MediaService,
    public recordService: RecordService,
  ) {}

  @Post(':id/file')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', ['mediaCreateOne'])
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(
    @Res({ passthrough: true }) res,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Media | RecordCreateStats> {
    // Checke media existsMedia>
    let media = await this.service.findOne(id);
    if (!media) throw new BadRequestException('Invalid Media Id');
    if (files.length > 1 || files.length === 0)
      throw new BadRequestException('You must upload 1 and only 1 file');

    // check access
    if (!this.service.checkMediaPerms(res, media))
      throw new ForbiddenException();

    // Only load the first file
    const recordStats = await this.recordService.uploadFiles(res, files);

    // Save and return media item or return the record stat errors
    if (recordStats.records.length) {
      media.record = recordStats.records[0];
      media = await this.service.repo.save(media);
      media.record = await this.recordService.signURL(media.record);
      return media;
    } else {
      return recordStats;
    }
  }

  @Override('getOneBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`mediaGetOne`])
  async getOne(
    @Res({ passthrough: true }) res: Response,
    @ParsedRequest() req: CrudRequest,
  ): Promise<Media> {
    let ret = await this.service.getOne(req);
    await getManager()
      .getTreeRepository(Media)
      .findDescendantsTree(ret, { relations: ['mediaRestriction'] });
    ret = await this.service.recursivelyEnforceMediaRestrictions(res, ret);
    return await this.service.recursivelySignRecordURLS(ret);
  }

  @Override('getManyBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`mediaGetMany`])
  async getMany(
    @Res({ passthrough: true }) res: Response,
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<Media> | Media[]> {
    let ret = await this.service.getMany(req);
    if (ret['data']) {
      ret = ret as GetManyDefaultResponse<Media>;
      for (let media of ret.data as Media[]) {
        await getManager()
          .getTreeRepository(Media)
          .findDescendantsTree(media, { relations: ['mediaRestriction'] });
        media = await this.service.recursivelyEnforceMediaRestrictions(
          res,
          media,
        );
        media = await this.service.recursivelySignRecordURLS(media);
      }
    } else {
      ret = ret as Media[];
      for (let media of ret) {
        await getManager()
          .getTreeRepository(Media)
          .findDescendantsTree(media, { relations: ['mediaRestriction'] });
        media = await this.service.recursivelyEnforceMediaRestrictions(
          res,
          media,
        );
        media = await this.service.recursivelySignRecordURLS(media);
      }
    }
    return ret;
  }
}
