import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('calendarevent')
export class Calendarevent extends ApptBaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('varchar', {
    name: 'locationURL',
    nullable: true,
    default: null,
    length: 1024,
  })
  locationUrl: string | null;

  @Column('varchar', {
    name: 'locationCoordinates',
    nullable: true,
    default: null,
    length: 1024,
  })
  locationCoordinates: string | null;

  @Column('timestamp')
  startTime: Date | null;

  @Column('varchar', {
    name: 'duration',
    nullable: true,
    default: null,
    length: 255,
  })
  duration: string | null;

  @Column('boolean', { default: false })
  cancelled: boolean | null;
}

export class CalendareventDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  locationUrl: string | null;

  @IsOptional()
  @IsString()
  locationCoordinates: string | null;

  @IsOptional()
  @IsDateString()
  startTime: string | null;

  @IsOptional()
  @IsString()
  duration: string | null;

  @IsOptional()
  @IsBoolean()
  cancelled: boolean | null;

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
