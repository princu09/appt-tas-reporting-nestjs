import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Calendarevent } from '../calendar-event/calendar-event.entity';
import { User } from '../user/user.entity';

@Entity('calendareventattendees')
@Unique(['event', 'attendee'])
export class Calendareventattendees extends ApptBaseEntity {
  @Column('varchar', {
    name: 'attendanceStatus',
    nullable: true,
    default: null,
    length: 255,
  })
  attendanceStatus: string | null;

  @ManyToOne(() => Calendarevent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event' })
  eventModel: Calendarevent;
  @Column({ nullable: true })
  event: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'attendee' })
  attendeeModel: User;
  @Column({ nullable: true })
  attendee: string;
}

export class CalendareventattendeesDTO {
  @IsString()
  @IsOptional()
  attendanceStatus: string | null;

  @IsString()
  @IsUUID()
  event: string;

  @IsString()
  @IsUUID()
  attendee: string;

  @IsOptional()
  @IsUUID()
  owner: string | null;

  @IsOptional()
  @IsUUID()
  organisation: string | null;

  @IsOptional()
  @IsUUID()
  site: string | null;
}
