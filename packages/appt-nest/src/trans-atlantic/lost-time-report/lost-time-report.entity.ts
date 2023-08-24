import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';

@Entity('lost-time-report')
export class LostTimeReport extends ApptBaseEntity {
  @Column('int', { default: 0 })
  numLostHoursPerWeekRain: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekStorm: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekHighWinds: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekHeatColdStressManagement: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekCOVID19: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekPowerCutsAndInterruptions: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekUnionStoppages: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekPermitToWorkAuthorizations: number;

  @Column('int', { default: 0 })
  numLostHoursPerWeekPlantStoppages: number;

  @ManyToOne(() => OrganisationContractor, (oc) => oc.contractorDataReports, {
    nullable: true,
  })
  @JoinColumn({ name: 'contractorId' })
  contractor: OrganisationContractor | null;
  @Column({ nullable: true })
  contractorId: string | null;

  @Column('boolean', { nullable: true })
  signature: boolean;
}

export class LostTimeReportDTO extends ApptBaseDTO {
  @IsOptional()
  @IsInt()
  numLostTimeInjuries: number;

  @IsOptional()
  @IsInt()
  numLostDays: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekRain: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekStorm: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekHighWinds: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekHeatColdStressManagement: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekCOVID19: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekPowerCutsAndInterruptions: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekUnionStoppages: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekPermitToWorkAuthorizations: number;

  @IsOptional()
  @IsInt()
  numLostHoursPerWeekPlantStoppages: number;

  @ManyToOne(() => OrganisationContractor, (oc) => oc.contractorDataReports, {
    nullable: true,
  })
  @JoinColumn({ name: 'contractorId' })
  @Exclude()
  contractor: OrganisationContractor | null;
  @Column({ nullable: true })
  @IsUUID('4')
  @IsOptional()
  @IsString()
  contractorId: string;

  @IsOptional()
  @IsBoolean()
  signature: boolean;
}
