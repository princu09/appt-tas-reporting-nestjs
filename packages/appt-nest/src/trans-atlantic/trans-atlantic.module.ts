import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { OrganisationModule } from 'src/auto-resources/organisation/organisation.module';
import { Role } from 'src/auto-resources/role/role.entity';
import { AreaModule } from './area/area.module';
import { ContractorDataReportModule } from './contractor-data-report/contractor-data-report.module';
import { IncidentFlashReportModule } from './incident-flash-report/incident-flash-report.module';
import { KpiModule } from './kpi/kpi.module';
import { LostTimeReportModule } from './lost-time-report/lost-time-report.module';
import { OrganisationContractorModule } from './organisation-contractor/organisation-contractor.module';
import { SafetyObservationsModule } from './safety-observations/safety-observations.module';
import { TransatlanticService } from './trans-atlanitc.service';

@Module({
  providers: [TransatlanticService],
  imports: [
    OrganisationModule,
    LostTimeReportModule,
    SafetyObservationsModule,
    IncidentFlashReportModule,
    ContractorDataReportModule,
    AreaModule,
    OrganisationContractorModule,
    KpiModule,
    TypeOrmModule.forFeature([Role, Organisation]),
  ],
})
export class TransAtlanticModule {}
