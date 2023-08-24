import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsService],
  exports: [AwsService],
  imports: [AwsModule, HttpModule],
})
export class AwsModule {}
