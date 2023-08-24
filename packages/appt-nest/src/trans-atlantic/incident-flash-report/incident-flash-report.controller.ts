import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Request, Response } from 'express';
import { defaultCrudPermissionNoRoute } from 'src/auto-api/default-crud-permissions';
import { OrgSiteOwnerPermissionInterceptor } from 'src/auto-api/org-site-owner-permission.interceptor';
import { LanguageCodeType } from 'src/dynamic-form/language-codes';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { PermissionsService } from 'src/services/permissions/permissions.service';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import {
  IncidentFlashReport,
  IncidentFlashReportDTO,
} from './incident-flash-report.entity';
import { IncidentFlashReportService } from './incident-flash-report.service';

@Crud({
  model: {
    type: IncidentFlashReport,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: IncidentFlashReportDTO,
    create: IncidentFlashReportDTO,
    replace: IncidentFlashReportDTO,
  },
  routes: {
    ...defaultCrudPermissionNoRoute('incident-flash-report'),
    only: [
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
      'recoverOneBase',
    ],
  },
  query: {
    join: {
      contractor: {
        eager: true,
      },
      area: {},
      picture: {
        eager: true,
      },
    },
  },
})
@ApiTags('incident-flash-report')
@Controller('incident-flash-report')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class IncidentFlashReportController
  implements CrudController<IncidentFlashReport>
{
  constructor(
    public service: IncidentFlashReportService,
    private permChecker: PermissionsService,
  ) {}

  @Override('createOneBase')
  @SetMetadata('permissions', [`incident-flash-reportCreateOne`])
  async createOne(
    @ParsedBody() dto: IncidentFlashReportDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.service.createOneOverride(
        res,
        dto as DeepPartial<IncidentFlashReport>,
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('files/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 20 }]))
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`incident-flash-reportGetOne`])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        picture: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @UploadedFiles() files: { picture: Express.Multer.File[] },
  ) {
    // Get the data
    const theData = await this.service.repo.findOneOrFail(id);

    if (!files.picture) {
      files.picture = [];
    } else if (!Array.isArray(files.picture)) {
      files.picture = [files.picture];
    }

    // Upload the images
    const photoEvidenceUploads = await this.service.recordService.uploadFiles(
      res,
      files.picture,
    );

    {
      // Update the photo evidence
      theData.picture = theData.picture.concat(photoEvidenceUploads.records);
      await this.service.repo.save(theData);
    }

    return theData;
  }

  @Get('form')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`incident-flash-reportGetOne`])
  getOpeningForm(
    @Res({ passthrough: true }) res: Response,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    return this.service.getForm(res, null, lc);
  }

  @Get(':id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`incident-flash-reportGetOne`])
  @Override('getOneBase')
  @ApiParam({
    name: 'languageCode',
    description: `Get the text in a different language`,
    example: 'English,Spanish',
  })
  async getOpeningExisting(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    const data = await this.service.parseEntityReturn(
      await this.service.repo.findOneOrFail(id, { relations: ['contractor'] }),
    );

    if (!(await this.permChecker.userCanAccess(req, res, data)))
      throw new ForbiddenException();

    return {
      data,
      form: this.service.getForm(res, data, lc),
    };
  }

  @Override('getManyBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`incident-flash-reportGetMany`])
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<
    GetManyDefaultResponse<IncidentFlashReport> | IncidentFlashReport[]
  > {
    const response = await this.service.getMany(req);

    if (Array.isArray(response)) {
      for (let so of response as IncidentFlashReport[]) {
        so = await this.service.parseEntityReturn(so);
      }
    } else {
      for (let so of (response as GetManyDefaultResponse<IncidentFlashReport>)
        .data) {
        so = await this.service.parseEntityReturn(so);
      }
    }

    return response;
  }
}
