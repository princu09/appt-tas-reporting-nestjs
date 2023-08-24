import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { Formsubmission } from '../form-submission/form-submission.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';

@Entity('formresponse')
export class Formresponse extends ApptBaseEntity {
  @ManyToOne(() => Formsubmission, (x) => x.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission' })
  submissionModel: Formsubmission;
  @Column({ nullable: true })
  submission: string;

  @Column('varchar', {
    name: 'questionkey',
    nullable: true,
    default: null,
    length: 255,
  })
  questionkey: string | null;

  @Column('varchar', {
    name: 'questiontext',
    nullable: true,
    default: null,
    length: 255,
  })
  questiontext: string | null;

  @Column('text', { name: 'response', nullable: true, default: null })
  response: string | null;

  @Column('varchar', {
    name: 'responsetype',
    nullable: true,
    default: null,
    length: 20,
  })
  responsetype: string | null;

  @Column('boolean', { default: false })
  hasbeenderived: boolean;

  @Column('boolean', { default: false })
  isderived: boolean;
}

export class FormresponseChildDTO {
  @IsOptional()
  @IsString()
  questionkey: string | null;

  @IsOptional()
  @IsString()
  questiontext: string | null;

  @IsOptional()
  @IsString()
  response: string | null;

  @IsOptional()
  @IsString()
  responsetype: string | null;

  @IsOptional()
  @IsBoolean()
  hasbeenderived: boolean;

  @IsOptional()
  @IsBoolean()
  isderived: boolean;

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

export class FormresponseDTO extends FormresponseChildDTO {
  @IsUUID()
  submission: string;
}
