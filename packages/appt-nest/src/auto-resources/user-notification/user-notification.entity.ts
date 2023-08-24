import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { User } from '../user/user.entity';

@Entity('usernotification')
export class Usernotification extends ApptBaseEntity {
  @Column('text', { nullable: true })
  title: string | null;

  @Column('text', { nullable: true })
  message: string | null;

  @Column('boolean', { name: 'read', nullable: true, default: null })
  read: boolean | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient' })
  recipientModel: User;
  @Column()
  recipient: string;
}

export class UsernotificationDTO {
  @IsOptional()
  @IsString()
  message: string | null;

  @IsOptional()
  @IsString()
  title: string | null;

  @IsUUID()
  recipient: string;

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
