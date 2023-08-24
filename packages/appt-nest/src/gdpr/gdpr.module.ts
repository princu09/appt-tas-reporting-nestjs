import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auto-resources/user/user.entity';
import { PermissionsModule } from 'src/services/permissions/permissions.module';
import { GdprController } from './gdpr.controller';
import { GdprService } from './gdpr.service';

@Module({
  controllers: [GdprController],
  providers: [GdprService],
  imports: [TypeOrmModule.forFeature([User]), PermissionsModule],
})
export class GdprModule {}
