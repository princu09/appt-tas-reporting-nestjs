import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from 'src/auto-resources/record/record.module';
import { User } from 'src/auto-resources/user/user.entity';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { Area } from '../area/area.entity';
import { OrganisationContractorModule } from '../organisation-contractor/organisation-contractor.module';
import { IncidentFlashReportController } from './incident-flash-report.controller';
import { IncidentFlashReport } from './incident-flash-report.entity';
import { IncidentFlashReportService } from './incident-flash-report.service';

@Module({
  controllers: [IncidentFlashReportController],
  providers: [IncidentFlashReportService],
  imports: [
    RecordModule,
    DynamicFormModule,
    TypeOrmModule.forFeature([IncidentFlashReport, Area, User]),
    OrganisationContractorModule,
    PermissionsModule,
  ],
})
export class IncidentFlashReportModule {}
