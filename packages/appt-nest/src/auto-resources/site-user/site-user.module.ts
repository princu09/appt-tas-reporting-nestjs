import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { SiteuserController } from './site-user.controller';
import { SiteuserService } from './site-user.service';
import { Siteuser } from './site-user.entity';

@Module({
  controllers: [SiteuserController],
  providers: [SiteuserService],
  imports: [TypeOrmModule.forFeature([Siteuser]), PermissionsModule],
})
export class SiteuserModule {}
