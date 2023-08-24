import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UsernotificationController } from './user-notification.controller';
import { UsernotificationService } from './user-notification.service';
import { Usernotification } from './user-notification.entity';

@Module({
  controllers: [UsernotificationController],
  providers: [UsernotificationService],
  imports: [TypeOrmModule.forFeature([Usernotification]), PermissionsModule],
})
export class UsernotificationModule {}
