import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from 'src/auto-resources/record/record.module';
import { DynamicFormModule } from 'src/dynamic-form/dynamic-form.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { TestFormController } from './test-form.controller';
import { TestForm } from './test-form.entity';
import { TestFormService } from './test-form.service';

@Module({
  controllers: [TestFormController],
  providers: [TestFormService],
  imports: [
    RecordModule,
    DynamicFormModule,
    TypeOrmModule.forFeature([TestForm]),
    PermissionsModule,
  ],
})
export class TestFormModule {}
