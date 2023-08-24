import { IsNumber, IsOptional } from 'class-validator';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('organisationcontract')
export class OrganisationContract extends ApptBaseEntity {
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cost: number;
}

export class OrganisationContractDTO extends ApptBaseDTO {
  @IsOptional()
  @IsNumber()
  cost: number | null;
}
