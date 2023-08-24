import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UserDeviceTokenController } from './user-device-token.controller';
import { UserDeviceTokenService } from './user-device-token.service';
import { UserDeviceToken } from './user-device-token.entity';

@Module({
  controllers: [UserDeviceTokenController],
  providers: [UserDeviceTokenService],
  exports: [UserDeviceTokenService],
  imports: [TypeOrmModule.forFeature([UserDeviceToken]), PermissionsModule],
})
export class UserDeviceTokenModule {}
