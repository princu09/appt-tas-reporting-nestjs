import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from '../../services/permissions/permissions.module';
import { CalendareventattendeesController } from './calendareventattendees.controller';
import { CalendareventattendeesService } from './calendareventattendees.service';
import { Calendareventattendees } from './calendareventattendees.entity';

@Module({
  controllers: [CalendareventattendeesController],
  providers: [CalendareventattendeesService],
  imports: [
    TypeOrmModule.forFeature([Calendareventattendees]),
    PermissionsModule,
  ],
})
export class CalendareventattendeesModule {}
