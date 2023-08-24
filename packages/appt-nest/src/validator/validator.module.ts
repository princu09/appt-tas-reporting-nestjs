import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auto-resources/user/user.entity';
import { UserExists } from './user-exists';

@Module({
  providers: [UserExists],
  imports: [TypeOrmModule.forFeature([User])],
})
export class ValidatorModule {}
