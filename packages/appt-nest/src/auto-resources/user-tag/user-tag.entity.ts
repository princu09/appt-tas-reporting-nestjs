import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('usertag')
export class Usertag extends ApptBaseEntity {
  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 25,
  })
  type: string | null;

  @Column('varchar', { name: 'key', nullable: true, default: null, length: 25 })
  key: string | null;

  @Column('text', { name: 'value', nullable: true, default: null })
  value: string | null;

  @Column('varchar', {
    name: 'fieldtype',
    nullable: true,
    default: null,
    length: 20,
  })
  fieldtype: string | null;

  @Column('varchar', {
    name: 'sensitivity',
    nullable: true,
    default: null,
    length: 15,
  })
  sensitivity: string | null;
}

export class UsertagDTO {
  @IsOptional()
  @IsString()
  type: string | null;

  @IsOptional()
  @IsString()
  key: string | null;

  @IsOptional()
  @IsString()
  value: string | null;

  @IsOptional()
  @IsString()
  fieldtype: string | null;

  @IsOptional()
  @IsString()
  sensitivity: string | null;

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
