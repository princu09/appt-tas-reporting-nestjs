import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UsergroupController } from './user-group.controller';
import { UsergroupService } from './user-group.service';
import { Usergroup } from './user-group.entity';

@Module({
  controllers: [UsergroupController],
  providers: [UsergroupService],
  imports: [TypeOrmModule.forFeature([Usergroup]), PermissionsModule],
})
export class UsergroupModule {}
