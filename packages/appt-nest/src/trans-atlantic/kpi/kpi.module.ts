import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';

@Module({
  controllers: [KpiController],
  providers: [KpiService],
  exports: [KpiService],
  imports: [
    TypeOrmModule.forFeature([Organisation, OrganisationContractor]),
    PermissionsModule,
  ],
})
export class KpiModule {}
