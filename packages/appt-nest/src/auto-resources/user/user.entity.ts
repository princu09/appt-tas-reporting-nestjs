import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncidentFlashReport } from '../../trans-atlantic/incident-flash-report/incident-flash-report.entity';
import { OrganisationContractor } from '../../trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { SafetyObservations } from '../../trans-atlantic/safety-observations/safety-observations.entity';
import { TriggerEmailContext } from '../email-template/email-template-trigger/email-template-trigger.service';
import { MessagingConversation } from '../messaging/messaging-conversation/messaging-conversation.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Roleuser } from '../role-user/role-user.entity';

export interface IUser {
  id: string;
}

@Entity('user')
export class User {
  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamptz', { nullable: true })
  lastLoggedIn: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    name: 'username',
    nullable: true,
    length: 255,
  })
  @Index('username', { unique: true })
  username: string | null;

  @Exclude()
  @Column('varchar', { name: 'password', nullable: true, length: 255 })
  password: string | null;

  @Index('email', { unique: true })
  @Column('varchar', { name: 'email', nullable: true, length: 255 })
  email: string | null;

  @Exclude()
  @Column('varchar', { name: 'verifyemailtoken', nullable: true, length: 255 })
  verifyemailtoken: string | null;

  @Exclude()
  @Column('uuid', { nullable: true })
  passwordResetToken: string | null;

  @Exclude()
  @Column('boolean', { name: 'changepassword', nullable: true })
  changepassword: boolean | null;

  @Column('varchar', { name: 'mobile', nullable: true, length: 255 })
  mobile: string | null;

  @Column('varchar', { name: 'firstname', nullable: true, length: 255 })
  firstname: string | null;

  @Column('varchar', { name: 'lastname', nullable: true, length: 255 })
  lastname: string | null;

  @Exclude()
  @Column('varchar', { name: 'devicetoken', nullable: true, length: 255 })
  devicetoken: string | null;

  @Exclude()
  @Column('boolean', { name: 'deleted', nullable: true, default: false })
  deleted: boolean;

  @Column('boolean', { name: 'apprated', nullable: true })
  apprated: boolean | null;

  @Exclude()
  @Column('boolean', { name: 'emailverified', nullable: true })
  emailverified: boolean | null;

  // Knight specific remove me probably.
  @Exclude()
  @Column({ default: true })
  actived: boolean;

  @Exclude()
  @Column('varchar', { name: 'touchid', nullable: true, length: 255 })
  touchid: string | null;

  @Column('int', { name: 'backendcurrentorganisation', nullable: true })
  backendcurrentorganisation: number | null;

  @Exclude()
  @Column('boolean', { default: false })
  isdeveloper: boolean;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  enabledbcache: boolean;

  @Column('varchar', { name: 'reference', nullable: true, length: 255 })
  reference: string | null;

  @Column('varchar', { name: 'ethnicity', nullable: true, length: 255 })
  ethnicity: string | null;

  @Column('varchar', { name: 'gender', nullable: true, length: 255 })
  gender: string | null;

  @Column('varchar', { name: 'jobTitle', nullable: true, length: 255 })
  jobTitle: string | null;

  @Column('varchar', {
    name: 'type',
    nullable: true,
    length: 255,
    default: () => "'user'",
  })
  type: string | null;

  @Column('timestamp', { name: 'dob', nullable: true })
  dob: Date | null;

  @Exclude()
  @Column('timestamp', { name: 'verificationExpires', nullable: true })
  verificationExpires: Date | null;

  @Exclude()
  @Column('int', { name: 'verificationCode', nullable: true, width: 5 })
  verificationCode: number | null;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  isglobaladmin: boolean;

  @Column('varchar', { name: 'addressLineOne', nullable: true, length: 255 })
  addressLineOne: string | null;

  @Column('varchar', { name: 'addressLineTwo', nullable: true, length: 255 })
  addressLineTwo: string | null;

  @Column('varchar', { name: 'city', nullable: true, length: 255 })
  city: string | null;

  @Column('varchar', { name: 'postcode', nullable: true, length: 255 })
  postcode: string | null;

  @Column('boolean', { default: false })
  selfSignUpProcessed: boolean | null;

  @Exclude()
  @Column('text', { nullable: true })
  stripeConnectAccountId: string | null;

  @Exclude()
  @Column('timestamp', { nullable: true })
  passwordLocked: Date;

  @Exclude()
  @Column('int', { default: 0 })
  passwordAttempts: number;

  @OneToMany(() => Roleuser, (role) => role.ownerModel)
  roles: Roleuser[];

  @ManyToMany(() => Organisation, (org) => org.users)
  organisations: Organisation[];

  @ManyToMany(() => MessagingConversation, (mc) => mc.chatters)
  messagingConversations: MessagingConversation[];

  @ManyToMany(() => OrganisationContractor, (contractor) => contractor.users)
  contractors: OrganisationContractor[];

  @OneToMany(() => SafetyObservations, (obs) => obs.ownerModel)
  safetyObservations: SafetyObservations[];

  @OneToMany(() => IncidentFlashReport, (obs) => obs.ownerModel)
  incidentFlashReport: IncidentFlashReport[];

  static getEmailTriggerContext(user: User): TriggerEmailContext {
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
      email: user.email,
    };
  }
}

export class UserDTO {
  @IsString()
  @Length(0, 255)
  username: string | null;

  @IsEmail()
  email: string | null;

  @IsOptional()
  @IsMobilePhone()
  mobile?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  firstname?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  lastname?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  reference?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  ethnicit?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  gender?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  jobTitle?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  type?: string | null;

  @IsOptional()
  @IsDateString()
  dob?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  addressLineOne?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  addressLineTwo?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  city?: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  postcode?: string | null;
}

export class UserUpdateDTO {
  @IsOptional()
  @IsMobilePhone()
  mobile: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  firstname: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  lastname: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  reference: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  ethnicity: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  gender: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  jobTitle: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  type: string | null;

  @IsOptional()
  @IsDateString()
  dob: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  addressLineOne: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  addressLineTwo: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  city: string | null;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  postcode: string | null;
}

export enum TransAtRoleTitles {
  KPI_ROLE = 'KPI_ROLE',
  ADMIN_ROLE = 'ADMIN_ROLE',
  APP_ROLE = 'APP_ROLE',
  HSE_ROLE = 'HSE_ROLE',
}

export enum TransAtUserPermissions {
  CREATE_KPI_USER = 'createKPIUser',
  CREATE_APP_USER = 'createAppUser',
  CREATE_ADMIN_USER = 'createAdminUser',
}

export class TransAtSignupBody {
  @IsEmail()
  username: string;
  @IsString()
  password: string;
}
