import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from 'src/auto-resources/record/record.module';
import { User } from 'src/auto-resources/user/user.entity';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';
import { OrganisationContractorModule } from '../organisation-contractor/organisation-contractor.module';
import { SafetyObservationsController } from './safety-observations.controller';
import { SafetyObservations } from './safety-observations.entity';
import { SafetyObservationsService } from './safety-observations.service';

@Module({
  controllers: [SafetyObservationsController],
  providers: [SafetyObservationsService],
  imports: [
    OrganisationContractorModule,
    RecordModule,
    DynamicFormModule,
    TypeOrmModule.forFeature([
      SafetyObservations,
      User,
      OrganisationContractor,
    ]),
    PermissionsModule,
  ],
})
export class SafetyObservationsModule {}
