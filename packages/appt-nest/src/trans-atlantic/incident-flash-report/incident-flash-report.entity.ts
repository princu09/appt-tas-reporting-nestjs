import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Record } from '../../auto-resources/record/record.entity';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Area } from '../area/area.entity';
import { OrganisationContractor } from '../organisation-contractor/organisation-contractor.entity';

@Entity('incident-flash-report')
export class IncidentFlashReport extends ApptBaseEntity {
  @Column('timestamp', { nullable: true })
  observed: Date;

  @ManyToOne(() => Area, (area) => area.flashReports, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'areaId' })
  area: Area | null;
  @Column({ nullable: true })
  areaId: string | null;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => Record, (rec) => rec.pictureIFR, { eager: true })
  picture: Record[];

  @ManyToOne(() => OrganisationContractor, (oc) => oc.flashReports, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'contractorId' })
  contractor: OrganisationContractor | null;
  @Column({ nullable: true })
  contractorId: string | null;

  @Column('boolean', { nullable: true })
  signature: boolean;
}

export class IncidentFlashReportDTO extends ApptBaseDTO {
  @IsDateString()
  @IsOptional()
  observed?: Date;

  @IsOptional()
  @IsUUID()
  @ValidateIf((e) => e === '')
  areaId?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  signature: boolean;
}
