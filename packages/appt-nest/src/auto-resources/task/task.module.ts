import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task]), PermissionsModule],
})
export class TaskModule {}
