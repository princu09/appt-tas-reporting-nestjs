import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { CalendareventController } from './calendar-event.controller';
import { CalendareventService } from './calendar-event.service';
import { Calendarevent } from './calendar-event.entity';

@Module({
  controllers: [CalendareventController],
  providers: [CalendareventService],
  imports: [TypeOrmModule.forFeature([Calendarevent]), PermissionsModule],
})
export class CalendareventModule {}
