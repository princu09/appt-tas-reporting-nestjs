import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { IncidentFlashReport } from '../incident-flash-report/incident-flash-report.entity';

@Entity('area')
export class Area extends ApptBaseEntity {
  @Column('text')
  name: string;

  @OneToMany(() => IncidentFlashReport, (flashReport) => flashReport.area)
  flashReports: IncidentFlashReport[];
}

export class AreaDTO extends ApptBaseDTO {
  @IsString()
  name: string;
}
