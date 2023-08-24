import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UsergroupadminController } from './user-group-admin.controller';
import { UsergroupadminService } from './user-group-admin.service';
import { Usergroupadmin } from './user-group-admin.entity';

@Module({
  controllers: [UsergroupadminController],
  providers: [UsergroupadminService],
  imports: [TypeOrmModule.forFeature([Usergroupadmin]), PermissionsModule],
})
export class UsergroupadminModule {}
