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

@Entity('contractor-data-report')
export class ContractorDataReport extends ApptBaseEntity {
  @Column('int', { nullable: true, default: 0 })
  weeklyWorkedHours: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  numOfWorkers: number;

  @Column('int', { default: 0 })
  numOfPropertyDamagedEvents: number;

  @Column('int', { default: 0 })
  numNearMisses: number;

  @Column('int', { default: 0 })
  numFirstAidInjuries: number;

  @Column('int', { default: 0 })
  medicalTreatmentInjuries: number;

  @Column('int', { default: 0 })
  numRestrictedWorkCase: number;

  @Column('int', { default: 0 })
  numLostDays: number;

  @Column('int', { default: 0 })
  numLostTimeInjuries: number;

  @Column('int', { default: 0 })
  numDeaths: number;

  @Column('int', { default: 0 })
  numRIDDORSpecifiedInjuries: number;

  @Column('int', { default: 0 })
  numRIDDORMajorInjuries: number;

  @Column('int', { default: 0 })
  numRIDDORDangerousOccurrences: number;

  @Column('int', { default: 0 })
  numRIDDOROccupationalIllnesses: number;

  @Column('int', { default: 0 })
  numRIDDOR7DayInjuries: number;

  @Column('int', { default: 0 })
  numOSHAJobTransferCases: number;

  @Column('int', { default: 0 })
  numOSHAJobTransferDays: number;

  @Column('int', { default: 0 })
  numOSHARecordableInjuries: number;

  @Column('int', { default: 0 })
  numLossConciounessCases: number;

  @Column('int', { default: 0 })
  numTier1PSECount: number;

  @Column('int', { default: 0 })
  numTier2PSECount: number;

  @Column('int', { default: 0 })
  numTier3PSECount: number;

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

export class ContractorDataReportDTO extends ApptBaseDTO {
  @IsOptional()
  @IsInt()
  weeklyWorkedHours: number;

  @IsOptional()
  @IsInt()
  numOfWorkers1: number;

  @IsOptional()
  @IsInt()
  numOfWorkers2: number;

  @IsOptional()
  @IsInt()
  numOfWorkers3: number;

  @IsOptional()
  @IsInt()
  numOfWorkers4: number;

  @IsOptional()
  @IsInt()
  numOfWorkers5: number;

  @IsOptional()
  @IsInt()
  numOfWorkers6: number;

  @IsOptional()
  @IsInt()
  numOfWorkers7: number;

  @IsOptional()
  @IsInt()
  numOfPropertyDamagedEvents: number;

  @IsOptional()
  @IsInt()
  numNearMisses: number;

  @IsOptional()
  @IsInt()
  numFirstAidInjuries: number;

  @IsOptional()
  @IsInt()
  medicalTreatmentInjuries: number;

  @IsOptional()
  @IsInt()
  numRestrictedWorkCase: number;

  @IsOptional()
  @IsInt()
  numLostDays: number;

  @IsOptional()
  @IsInt()
  numLostTimeInjuries: number;

  @IsOptional()
  @IsInt()
  numDeaths: number;

  @IsOptional()
  @IsInt()
  numRIDDORSpecifiedInjuries: number;

  @IsOptional()
  @IsInt()
  numRIDDORMajorInjuries: number;

  @IsOptional()
  @IsInt()
  numRIDDORDangerousOccurrences: number;

  @IsOptional()
  @IsInt()
  numRIDDOROccupationalIllnesses: number;

  @IsOptional()
  @IsInt()
  numRIDDOR7DayInjuries: number;

  @IsOptional()
  @IsInt()
  numOSHAJobTransferCases: number;

  @IsOptional()
  @IsInt()
  numOSHAJobTransferDays: number;

  @IsOptional()
  @IsInt()
  numOSHARecordableInjuries: number;

  @IsOptional()
  @IsInt()
  numLossConciounessCases: number;

  @IsOptional()
  @IsInt()
  numTier1PSECount: number;

  @IsOptional()
  @IsInt()
  numTier2PSECount: number;

  @IsOptional()
  @IsInt()
  numTier3PSECount: number;

  @IsUUID('4')
  @IsOptional()
  @IsString()
  contractorId: string;

  @IsOptional()
  @IsBoolean()
  signature: boolean;
}
