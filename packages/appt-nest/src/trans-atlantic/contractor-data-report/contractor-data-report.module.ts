import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auto-resources/user/user.entity';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { OrganisationContractorModule } from '../organisation-contractor/organisation-contractor.module';
import { ContractorDataReportController } from './contractor-data-report.controller';
import { ContractorDataReport } from './contractor-data-report.entity';
import { ContractorDataReportService } from './contractor-data-report.service';

@Module({
  controllers: [ContractorDataReportController],
  providers: [ContractorDataReportService],
  imports: [
    DynamicFormModule,
    TypeOrmModule.forFeature([ContractorDataReport, User]),
    PermissionsModule,
    OrganisationContractorModule,
  ],
})
export class ContractorDataReportModule {}
