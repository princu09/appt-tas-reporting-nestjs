import { IsOptional, IsUUID } from 'class-validator';
import { Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('siteuser')
export class Siteuser extends ApptBaseEntity {}

export class SiteuserDTO {
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
