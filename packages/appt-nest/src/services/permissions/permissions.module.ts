import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roleuser } from '../../auto-resources/role-user/role-user.entity';
import { PermissionsService } from './permissions.service';

@Module({
  providers: [PermissionsService],
  exports: [PermissionsService],
  imports: [TypeOrmModule.forFeature([Roleuser])],
})
export class PermissionsModule {}
