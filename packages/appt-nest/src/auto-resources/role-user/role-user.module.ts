import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { RoleuserController } from './role-user.controller';
import { RoleuserService } from './role-user.service';
import { Roleuser } from './role-user.entity';

@Module({
  controllers: [RoleuserController],
  providers: [RoleuserService],
  imports: [TypeOrmModule.forFeature([Roleuser]), PermissionsModule],
})
export class RoleuserModule {}
