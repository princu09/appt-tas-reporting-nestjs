import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Logger,
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
import { GetByContractorInterceptor } from './get-by-contractor.interceptor';
import {
  SafetyObservations,
  SafetyObservationsDTO,
} from './safety-observations.entity';
import { SafetyObservationsService } from './safety-observations.service';

@Crud({
  model: {
    type: SafetyObservations,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: SafetyObservationsDTO,
    create: SafetyObservationsDTO,
    replace: SafetyObservationsDTO,
  },
  routes: {
    ...defaultCrudPermissionNoRoute('safety-observations'),
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
      photoEvidenceClosure: {
        eager: true,
      },
      photoEvidence: {
        eager: true,
      },
    },
  },
})
@ApiTags('safety-observations')
@Controller('safety-observations')
@UseInterceptors(
  GetByContractorInterceptor,
  OrgSiteOwnerPermissionInterceptor,
  CrudRequestInterceptor,
)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class SafetyObservationsController
  implements CrudController<SafetyObservations>
{
  private readonly logger = new Logger(SafetyObservationsController.name);
  constructor(
    public service: SafetyObservationsService,
    private permChecker: PermissionsService,
  ) {}

  @Override('updateOneBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsUpdateOne`])
  async createOne(
    @ParsedBody() dto: SafetyObservationsDTO,
    @Param('id') id: string,
  ) {
    try {
      return this.service.updateOneOverride(id, dto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('files/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photoEvidence', maxCount: 20 },
      { name: 'photoEvidenceClosure', maxCount: 20 },
    ]),
  )
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsCreateOne`])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photoEvidence: {
          type: 'string',
          format: 'binary',
        },
        photoEvidenceClosure: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      photoEvidence: Express.Multer.File[];
      photoEvidenceClosure: Express.Multer.File[];
    },
  ) {
    // Get the data
    const theData = await this.service.repo.findOneOrFail(id);

    if (!files.photoEvidence) {
      files.photoEvidence = [];
    } else if (!Array.isArray(files.photoEvidence)) {
      files.photoEvidence = [files.photoEvidence];
    }

    if (!files.photoEvidenceClosure) {
      files.photoEvidenceClosure = [];
    } else if (!Array.isArray(files.photoEvidenceClosure)) {
      files.photoEvidenceClosure = [files.photoEvidenceClosure];
    }

    // Upload the images
    const photoEvidenceUploads = await this.service.recordService.uploadFiles(
      res,
      files.photoEvidence,
    );
    const photoEvidenceClosureUploads =
      await this.service.recordService.uploadFiles(
        res,
        files.photoEvidenceClosure,
      );

    {
      // Update the photo evidence
      theData.photoEvidence = theData.photoEvidence.concat(
        photoEvidenceUploads.records,
      );
      theData.photoEvidenceClosure = theData.photoEvidenceClosure.concat(
        photoEvidenceClosureUploads.records,
      );
      await this.service.repo.save(theData);
    }

    return theData;
  }

  @Get('opening')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsCreateOne`])
  @ApiParam({
    name: 'languageCode',
    description: `Get the text in a different language`,
    example: 'English,Spanish',
  })
  getOpeningForm(
    @Res({ passthrough: true }) res: Response,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    return this.service.getDynamicFormOpening(res, null, lc);
  }

  @Get('closing')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsCreateOne`])
  @ApiParam({
    name: 'languageCode',
    description: `Get the text in a different language`,
    example: 'English,Spanish',
  })
  getClosingForm(
    @Res({ passthrough: true }) res: Response,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    return this.service.getDynamicFormClosing(res, null, lc);
  }

  @Get('opening/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsCreateOne`])
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
      await this.service.repo.findOneOrFail(id),
    );

    if (!(await this.permChecker.userCanAccess(req, res, data)))
      throw new ForbiddenException();

    return {
      data,
      form: await this.service.getDynamicFormOpening(res, data, lc),
    };
  }

  @Get('closing/:id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsCreateOne`])
  @ApiParam({
    name: 'languageCode',
    description: `Get the text in a different language`,
    example: 'English,Spanish',
  })
  async getClosingExisting(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    try {
      const data = await this.service.parseEntityReturn(
        await this.service.repo.findOneOrFail(id),
      );

      if (!(await this.permChecker.userCanAccess(req, res, data)))
        throw new ForbiddenException();

      return {
        data,
        form: await this.service.getDynamicFormClosing(res, data, lc),
      };
    } catch (err) {
      this.logger.error(err);
    }
    throw new InternalServerErrorException();
  }

  @Override('getManyBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsGetMany`])
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<
    GetManyDefaultResponse<SafetyObservations> | SafetyObservations[]
  > {
    const response = await this.service.getMany(req);

    if (Array.isArray(response)) {
      for (let so of response as SafetyObservations[]) {
        so = await this.service.parseEntityReturn(so);
      }
    } else {
      for (let so of (response as GetManyDefaultResponse<SafetyObservations>)
        .data) {
        so = await this.service.parseEntityReturn(so);
      }
    }

    return response;
  }

  @Override('getOneBase')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`safety-observationsGetOne`])
  async getOne(@ParsedRequest() req: CrudRequest): Promise<SafetyObservations> {
    const response = await this.service.getOne(req);
    return await this.service.parseEntityReturn(response);
  }
}
