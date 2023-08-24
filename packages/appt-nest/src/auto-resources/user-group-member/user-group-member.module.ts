import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { UsergroupmemberController } from './user-group-member.controller';
import { UsergroupmemberService } from './user-group-member.service';
import { Usergroupmember } from './user-group-member.entity';

@Module({
  controllers: [UsergroupmemberController],
  providers: [UsergroupmemberService],
  imports: [TypeOrmModule.forFeature([Usergroupmember]), PermissionsModule],
})
export class UsergroupmemberModule {}
