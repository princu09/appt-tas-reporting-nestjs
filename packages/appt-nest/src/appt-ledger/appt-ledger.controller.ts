import {
  Controller,
  Get,
  Param,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { HasOrganisationGuard } from 'src/guards/has-organisation.guard';
import { HasSiteGuard } from 'src/guards/has-site.guard';
import { IsLoggedInGuard } from 'src/guards/is-logged-in.guard';
import { UserHasPermissionGuard } from 'src/guards/user-has-permission.guard';
import { LocalsService } from 'src/services/locals/locals.service';
import { ApptLedgerService } from './appt-ledger.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appt-ledger')
@Controller('appt-ledger')
@UseGuards(
  IsLoggedInGuard,
  HasOrganisationGuard,
  HasSiteGuard,
  UserHasPermissionGuard,
)
@SetMetadata('permissions', [`ViewOrganisationLedger`])
export class ApptLedgerController {
  constructor(
    private readonly apptLedgerService: ApptLedgerService,
    private locals: LocalsService,
  ) {}

  @Get()
  Get(
    @Res({ passthrough: true }) res: Response,
    @Param('startTime') start: string | null,
    @Param('endTime') end: string | null,
  ) {
    return this.apptLedgerService.get(
      this.locals.getOrganisation(res),
      start,
      end,
    );
  }

  // TODO:
  // Test the get service
  // Test the permissions should be ViewOrganisationLedger / gadmin / dev
  // Work out how to accept payment with stripe from an appt customer
}
