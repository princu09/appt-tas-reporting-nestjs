import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import {
  OrganisationEmailTemplate,
  OrganisationEmailTemplateDTO,
} from '../organisation-email-template/organisation-email-template.entity';
import { EmailTemplateAttachments } from './email-template-attachments.entity';

@Entity('email-template')
export class EmailTemplate extends ApptBaseEntity {
  @Column('text')
  fromAddress: string;

  @Column('text')
  subject: string;

  @Column('text')
  title: string;

  @ManyToOne(() => OrganisationEmailTemplate, { eager: true, cascade: true })
  @JoinColumn({ name: 'templateId' })
  template: OrganisationEmailTemplate;
  @Column()
  templateId: string;

  @Column('text', { nullable: true })
  CC: string;

  @Column('text', { nullable: true })
  BCC: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('text', { array: true, nullable: true })
  @ApiProperty({
    description:
      'An array of triggers that will cause the sending of this email template.',
  })
  triggers: string[];

  @Column('int', { nullable: true })
  @ApiProperty({
    description:
      'When the trigger is hit this will be the delay between receiving the trigger and sending the template',
  })
  delayMinutes: number;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  globalDefault: boolean;

  @OneToMany(() => EmailTemplateAttachments, (eta) => eta.emailTemplate, {
    eager: true,
  })
  attachments: EmailTemplateAttachments[];
}

export class EmailTemplateDTO {
  @IsEmail()
  fromAddress: string;

  @IsString()
  subject: string;

  @IsUUID()
  @IsOptional()
  templateId: string;

  @IsOptional()
  template: OrganisationEmailTemplateDTO | null;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  CC: string;

  @IsOptional()
  @IsString()
  BCC: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  triggers: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  delayMinutes: number;

  @IsOptional()
  @IsUUID()
  owner: string | null;

  @IsOptional()
  @IsBoolean()
  globalDefault?: boolean | null;

  @IsOptional()
  @IsUUID()
  organisation: string | null;

  @IsOptional()
  @IsUUID()
  site: string | null;

  @IsOptional()
  @IsBoolean()
  active: boolean | null;

  @IsUUID(4, { each: true })
  @IsOptional()
  @ApiProperty({
    description:
      'An array of Record ids, if you have permission to the records these will be attached to the email when sent.',
  })
  attachments: string[] | null;
}
