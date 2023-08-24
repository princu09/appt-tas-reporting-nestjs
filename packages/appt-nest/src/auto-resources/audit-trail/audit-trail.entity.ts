import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { User } from '../user/user.entity';

@Entity('audittrail')
export class Audittrail extends ApptBaseEntity {
  @Column('varchar', {
    name: 'type',
    nullable: true,
    default: null,
    length: 25,
  })
  type: string | null;

  @Column('varchar', { name: 'key', nullable: true, default: null, length: 25 })
  key: string | null;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    default: null,
    length: 255,
  })
  description: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'subject' })
  subjectModel: User;
  @Column({ nullable: true })
  subject: string;

  @Column('boolean', { name: 'restricted', nullable: true, default: null })
  restricted: boolean | null;

  @Column('text', { name: 'additionalData', nullable: true, default: null })
  additionalData: string | null;
}

export class AudittrailDTO {
  @IsOptional()
  @IsString()
  type: string | null;

  @IsOptional()
  @IsString()
  key: string | null;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsUUID()
  subject: string;

  @IsOptional()
  @IsBoolean()
  restricted: boolean | null;

  @IsOptional()
  @IsString()
  additionalData: string | null;

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
