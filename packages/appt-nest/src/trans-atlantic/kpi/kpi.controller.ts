import {
  Controller,
  Get,
  Query,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as moment from 'moment';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { KpiService } from './kpi.service';

@ApiTags('kpi')
@Controller('kpi')
@UseGuards(IsLoggedInGuard, HasOrganisationGuard, HasSiteGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`getKPIS`])
  @Get()
  getKpis(
    @Res({ passthrough: true }) res: Response,
    @Query('startDate') startDate?: string | null,
    @Query('endDate') endDate?: string | null,
  ) {
    const startDateParsed =
      startDate && moment(startDate).isValid()
        ? moment(startDate).toDate()
        : moment().subtract(100, 'year').toDate();
    const endDateParsed =
      startDate && moment(endDate).isValid()
        ? moment(endDate).toDate()
        : new Date();
    return this.kpiService.getKpis(res, startDateParsed, endDateParsed);
  }

  @UseGuards(UserHasPermissionGuard)
  @SetMetadata('permissions', [`getKPIS`])
  @Get('list')
  getKpisList(@Res({ passthrough: true }) res: Response) {
    return this.kpiService.getKpiList(res);
  }
}
