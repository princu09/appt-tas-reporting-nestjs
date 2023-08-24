import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auto-resources/user/user.entity';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { OrganisationContractorModule } from '../organisation-contractor/organisation-contractor.module';
import { LostTimeReportController } from './lost-time-report.controller';
import { LostTimeReport } from './lost-time-report.entity';
import { LostTimeReportService } from './lost-time-report.service';

@Module({
  controllers: [LostTimeReportController],
  providers: [LostTimeReportService],
  imports: [
    DynamicFormModule,
    TypeOrmModule.forFeature([LostTimeReport, User]),
    PermissionsModule,
    OrganisationContractorModule,
  ],
})
export class LostTimeReportModule {}
