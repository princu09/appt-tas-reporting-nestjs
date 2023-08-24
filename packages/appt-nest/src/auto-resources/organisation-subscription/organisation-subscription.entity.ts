import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('organisationsubscription')
export class Organisationsubscription extends ApptBaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('varchar', {
    name: 'friendlyDescription',
    nullable: true,
    default: null,
    length: 255,
  })
  friendlyDescription: string | null;

  @Column('varchar', {
    name: 'statementDescription',
    nullable: true,
    default: null,
    length: 20,
  })
  statementDescription: string | null;

  @Column('int', { name: 'annualFee', nullable: true, default: null })
  annualFee: number | null;

  @Column('int', { name: 'numAllowedUsers', nullable: true, default: null })
  numAllowedUsers: number | null;
}

export class OrganisationsubscriptionDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  friendlyDescription: string | null;

  @IsOptional()
  @IsString()
  statementDescription: string | null;

  @IsOptional()
  @IsNumber()
  annualFee: number | null;

  @IsOptional()
  @IsNumber()
  numAllowedUsers: number | null;

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
