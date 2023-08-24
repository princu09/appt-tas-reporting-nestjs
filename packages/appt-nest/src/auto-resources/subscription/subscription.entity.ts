import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('subscription')
export class Subscription extends ApptBaseEntity {
  @Column('varchar', {
    name: 'title',
    nullable: true,
    default: null,
    length: 255,
  })
  title: string | null;

  @Column('text', { name: 'description', nullable: true, default: null })
  description: string | null;

  @Column('varchar', {
    name: 'appleId',
    nullable: true,
    default: null,
    length: 255,
  })
  appleId: string | null;

  @Column('varchar', {
    name: 'googleId',
    nullable: true,
    default: null,
    length: 255,
  })
  googleId: string | null;
}

export class SubscriptionDTO {
  @IsString()
  title: string | null;

  @IsString()
  description: string | null;

  @IsString()
  @IsOptional()
  appleId: string | null;

  @IsString()
  @IsOptional()
  googleId: string | null;

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
