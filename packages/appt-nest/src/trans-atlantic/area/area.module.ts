import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { Area } from './area.entity';

@Module({
  controllers: [AreaController],
  providers: [AreaService],
  imports: [TypeOrmModule.forFeature([Area]), PermissionsModule],
})
export class AreaModule {}
