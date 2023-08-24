import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { FormresponseController } from './form-response.controller';
import { FormresponseService } from './form-response.service';
import { Formresponse } from './form-response.entity';

@Module({
  controllers: [FormresponseController],
  providers: [FormresponseService],
  imports: [TypeOrmModule.forFeature([Formresponse]), PermissionsModule],
})
export class FormresponseModule {}
