import { Module } from '@nestjs/common';
import { DynamicFormService } from './dynamic-form.service';

@Module({
  controllers: [],
  providers: [DynamicFormService],
  exports: [DynamicFormService],
})
export class DynamicFormModule {}
