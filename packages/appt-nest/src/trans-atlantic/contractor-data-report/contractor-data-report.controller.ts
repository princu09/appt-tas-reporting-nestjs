import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequestInterceptor,
  Override,
  ParsedBody,
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
import { DeepPartial } from 'typeorm';
import {
  ContractorDataReport,
  ContractorDataReportDTO,
} from './contractor-data-report.entity';
import { ContractorDataReportService } from './contractor-data-report.service';

@Crud({
  model: {
    type: ContractorDataReport,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  dto: {
    update: ContractorDataReportDTO,
    create: ContractorDataReportDTO,
    replace: ContractorDataReportDTO,
  },
  routes: {
    ...defaultCrudPermissionNoRoute('contractor-data-report'),
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
    },
  },
})
@ApiTags('weekly-data-report')
@Controller('weekly-data-report')
@UseInterceptors(OrgSiteOwnerPermissionInterceptor, CrudRequestInterceptor)
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class ContractorDataReportController
  implements CrudController<ContractorDataReport>
{
  constructor(
    public service: ContractorDataReportService,
    private permChecker: PermissionsService,
  ) {}

  @Override('createOneBase')
  @SetMetadata('permissions', [`contractor-data-reportCreateOne`])
  async createOne(
    @ParsedBody() dto: ContractorDataReportDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.service.createOneOverride(
        res,
        dto as DeepPartial<ContractorDataReport>,
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('form')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`contractor-data-reportGetOne`])
  getOpeningForm(@Query('languageCode') lc: LanguageCodeType = 'English') {
    return this.service.getForm(null, lc);
  }

  @Get(':id')
  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`contractor-data-reportGetOne`])
  @Override('getOneBase')
  @ApiParam({
    name: 'languageCode',
    description: `Get the text in a different language`,
    example: 'English, Spanish',
  })
  async getOpeningExisting(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
    @Query('languageCode') lc: LanguageCodeType = 'English',
  ) {
    const data = await this.service.repo.findOneOrFail(id, {
      relations: ['contractor'],
    });

    if (!(await this.permChecker.userCanAccess(req, res, data)))
      throw new ForbiddenException();

    return {
      data,
      form: await this.service.getForm(data, lc),
    };
  }
}
