import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordModule } from 'src/auto-resources/record/record.module';
import { AwsModule } from 'src/services/aws/aws.module';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import {
  ChunkUploadController,
  ChunkUploadCreateController,
} from './chunk-upload.controller';
import { ChunkUpload } from './chunk-upload.entity';
import { ChunkUploadService } from './chunk-upload.service';

@Module({
  controllers: [ChunkUploadController, ChunkUploadCreateController],
  providers: [ChunkUploadService],
  imports: [
    TypeOrmModule.forFeature([ChunkUpload]),
    RecordModule,
    AwsModule,
    PermissionsModule,
  ],
})
export class ChunkUploadModule {}
