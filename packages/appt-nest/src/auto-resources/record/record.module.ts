import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/services/aws/aws.module';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { RecordController } from './record.controller';
import { Record } from './record.entity';
import { RecordService } from './record.service';

@Module({
  exports: [RecordService],
  controllers: [RecordController],
  providers: [RecordService],
  imports: [TypeOrmModule.forFeature([Record]), PermissionsModule, AwsModule],
})
export class RecordModule {}
