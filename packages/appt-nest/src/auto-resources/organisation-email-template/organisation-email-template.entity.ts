import { IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('organisationemailtemplate')
export class OrganisationEmailTemplate extends ApptBaseEntity {
  @Column('text')
  html: string;

  @Column('text')
  name: string;
}

export class OrganisationEmailTemplateDTO extends ApptBaseDTO {
  @IsOptional()
  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  name: string;
}
