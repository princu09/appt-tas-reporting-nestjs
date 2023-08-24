import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { FormsubmissionController } from './form-submission.controller';
import { FormsubmissionService } from './form-submission.service';
import { Formsubmission } from './form-submission.entity';

@Module({
  controllers: [FormsubmissionController],
  providers: [FormsubmissionService],
  imports: [TypeOrmModule.forFeature([Formsubmission]), PermissionsModule],
})
export class FormsubmissionModule {}
