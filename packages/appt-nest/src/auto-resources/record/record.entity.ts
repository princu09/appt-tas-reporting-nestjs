import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { IncidentFlashReport } from '../../trans-atlantic/incident-flash-report/incident-flash-report.entity';
import { SafetyObservations } from '../../trans-atlantic/safety-observations/safety-observations.entity';

@Entity('record')
export class Record extends ApptBaseEntity {
  @Column('varchar', { name: 'fileName', length: 2048 })
  fileName: string;

  @Column('varchar', { name: 'fileURL', length: 2048 })
  fileUrl: string;

  @Column('varchar', { name: 'fileType', length: 10 })
  fileType: string;

  @ManyToOne(() => SafetyObservations, (so) => so.photoEvidence)
  photoEvidenceSo: SafetyObservations;

  @ManyToOne(() => SafetyObservations, (so) => so.photoEvidenceClosure)
  photoEvidenceClosureSo: SafetyObservations;

  @ManyToOne(() => IncidentFlashReport, (ifr) => ifr.picture)
  pictureIFR: IncidentFlashReport;
}

export class RecordDTO {
  @IsString()
  fileName: string;

  @IsUrl()
  fileUrl: string;

  @IsString()
  fileType: string;

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
