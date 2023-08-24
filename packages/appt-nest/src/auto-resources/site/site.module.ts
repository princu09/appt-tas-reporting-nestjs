import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { Siteuser } from '../site-user/site-user.entity';
import { SiteController } from './site.controller';
import { Site } from './site.entity';
import { SiteService } from './site.service';

@Module({
  controllers: [SiteController],
  providers: [SiteService],
  imports: [TypeOrmModule.forFeature([Site, Siteuser]), PermissionsModule],
  exports: [SiteService],
})
export class SiteModule {}
