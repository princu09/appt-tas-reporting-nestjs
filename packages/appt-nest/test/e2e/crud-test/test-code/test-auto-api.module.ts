import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../../../src/services/permissions/permissions.module';
import { TestAutoApiController } from './test-auto-api.controller';
import { TestAutoApi } from './test-auto-api.entity';
import { TestAutoApiService } from './test-auto-api.service';

@Module({
  controllers: [TestAutoApiController],
  providers: [TestAutoApiService],
  imports: [TypeOrmModule.forFeature([TestAutoApi]), PermissionsModule]
})
export class TestAutoApiModule {}
