import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { OrganisationEmailTemplate } from '../organisation-email-template/organisation-email-template.entity';
import { User } from '../user/user.entity';

export enum NotificationType {
  email = 0,
  sms = 1,
  push = 2,
}

export enum NotificationStatus {
  waiting = 0,
  sent = 1,
  failed = 2,
}

@Entity('notification')
export class Notification extends ApptBaseEntity {
  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.waiting,
  })
  status: NotificationStatus;

  @Column({ type: 'uuid', nullable: true, default: null })
  targetUserId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetUserId' })
  targetUser: User;

  @Column('text')
  from: string;

  @Column('text')
  subject: string;

  @Column('text')
  body: string;

  @Column('jsonb', { nullable: true })
  data: { [key: string]: string };

  @ManyToOne(() => OrganisationEmailTemplate, { nullable: true, eager: true })
  @JoinColumn({ name: 'templateId' })
  template: OrganisationEmailTemplate;
  @Column()
  templateId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;
}

export class NotificationDTO {
  @IsUUID()
  targetUserId: string;
  @IsString()
  subject: string;
  @IsString()
  body: string;
  @IsString()
  data: string;
  @IsString()
  from: string;

  @IsEnum(NotificationType)
  type: NotificationType;

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
