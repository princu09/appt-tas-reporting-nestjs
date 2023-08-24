import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('usergroup')
export class Usergroup extends ApptBaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('text', { name: 'description', nullable: true, default: null })
  description: string | null;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 55,
  })
  type: string | null;
}

export class UsergroupDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsString()
  type: string | null;

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
