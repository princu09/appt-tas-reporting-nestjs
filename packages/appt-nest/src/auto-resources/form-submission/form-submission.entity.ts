import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import {
  Formresponse,
  FormresponseChildDTO,
} from '../form-response/form-response.entity';
import { User } from '../user/user.entity';

@Entity('formsubmission')
export class Formsubmission extends ApptBaseEntity {
  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 25,
  })
  type: string | null;

  @Column('varchar', {
    name: 'reference',
    nullable: true,
    default: null,
    length: 255,
  })
  reference: string | null;

  @Column('varchar', {
    name: 'status',
    nullable: true,
    default: null,
    length: 10,
  })
  status: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject' })
  subjectModel: User | null;
  @Column({ nullable: true })
  subject: string | null;

  @OneToMany(() => Formresponse, (x) => x.submissionModel, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  responses: Formresponse[];

  @Column('varchar', {
    name: 'pdfUrl',
    nullable: true,
    default: null,
    length: 255,
  })
  pdfUrl: string | null;

  @Column('varchar', {
    name: 'uuid',
    nullable: true,
    default: null,
    length: 36,
  })
  uuid: string | null;

  @Column('boolean', {
    default: false,
  })
  processed: boolean;
}

export class FormsubmissionDTO {
  @IsOptional()
  @IsString()
  type: string | null;

  @IsOptional()
  @IsString()
  reference: string | null;

  @IsOptional()
  @Type(() => FormresponseChildDTO)
  @ValidateNested({ each: true })
  responses: FormresponseChildDTO[];

  @IsOptional()
  @IsString()
  status: string | null;

  @IsOptional()
  @IsUUID()
  subject: string | null;

  @IsOptional()
  @IsString()
  pdfUrl: string | null;

  @IsOptional()
  @IsString()
  uuid: string | null;

  @IsOptional()
  @IsBoolean()
  processed: boolean | null;

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
