import { IsOptional, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('siteadmin')
export class Siteadmin extends ApptBaseEntity {}

export class SiteadminDTO {
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
