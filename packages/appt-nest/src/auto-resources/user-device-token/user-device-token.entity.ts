import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity()
export class UserDeviceToken extends ApptBaseEntity {
  @Index()
  @Column('text', { nullable: false })
  deviceToken: string;
}

export class UserDeviceTokenDTO {
  @IsString()
  deviceToken: string;

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
