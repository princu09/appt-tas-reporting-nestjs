import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UserdirectaccessController } from './user-direct-access.controller';
import { UserdirectaccessService } from './user-direct-access.service';
import { Userdirectaccess } from './user-direct-access.entity';

@Module({
  controllers: [UserdirectaccessController],
  providers: [UserdirectaccessService],
  imports: [TypeOrmModule.forFeature([Userdirectaccess]), PermissionsModule],
})
export class UserdirectaccessModule {}
