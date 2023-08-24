import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UsertagController } from './user-tag.controller';
import { UsertagService } from './user-tag.service';
import { Usertag } from './user-tag.entity';

@Module({
  controllers: [UsertagController],
  providers: [UsertagService],
  imports: [TypeOrmModule.forFeature([Usertag]), PermissionsModule],
})
export class UsertagModule {}
