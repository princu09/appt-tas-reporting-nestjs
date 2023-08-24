import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('task')
export class Task extends ApptBaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('text', { name: 'additionalData', nullable: true, default: null })
  additionalData: string | null;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 255,
  })
  type: string | null;

  @Column('varchar', {
    name: 'status',
    nullable: true,
    default: null,
    length: 255,
  })
  status: string | null;

  @Column('text', { name: 'description', nullable: true, default: null })
  description: string | null;

  @Column('timestamp', { name: 'completedBy', nullable: true, default: null })
  completedBy: Date | null;

  @Column('int', { name: 'notifyAt', nullable: true, default: null })
  notifyAt: number | null;
}

export class TaskDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  additionalData: string | null;

  @IsOptional()
  @IsString()
  type: string | null;

  @IsOptional()
  @IsString()
  status: string | null;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsDateString()
  completedBy: string | null;

  @IsOptional()
  @IsNumber()
  notifyAt: number | null;

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
