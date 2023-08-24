import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { SiteadminController } from './site-admin.controller';
import { SiteadminService } from './site-admin.service';
import { Siteadmin } from './site-admin.entity';

@Module({
  controllers: [SiteadminController],
  providers: [SiteadminService],
  imports: [TypeOrmModule.forFeature([Siteadmin]), PermissionsModule],
})
export class SiteadminModule {}
