import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { Column, Entity } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

/**
 * List of one off charges made against an organistion
 */
@Entity('organisationcharge')
export class OrganisationCharge extends ApptBaseEntity {
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cost: number;

  @Column('text', { nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'Has the charge been processed by the appt ledger cron job',
  })
  @Column('boolean', { default: false })
  processed: boolean;
}

export class OrganisationChargeDTO extends ApptBaseDTO {
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsString()
  description: string | null;
}
