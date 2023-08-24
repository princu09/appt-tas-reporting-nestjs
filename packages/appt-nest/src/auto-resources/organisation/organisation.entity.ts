import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApptBaseDTO } from '../../base/appt-base-dto';
import { Area, AreaDTO } from '../../trans-atlantic/area/area.entity';
import {
  OrganisationContractor,
  OrganisationContractorDTO,
} from '../../trans-atlantic/organisation-contractor/organisation-contractor.entity';
import { Record } from '../record/record.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

export interface IOrganisation {
  id: string;
}

@Entity('organisation')
export class Organisation {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('boolean', { name: 'deleted', nullable: true, default: null })
  deleted: boolean | null;

  @Column('varchar', {
    name: 'primarycolour',
    nullable: true,
    default: null,
    length: 255,
  })
  primarycolour: string | null;

  @Column('varchar', {
    name: 'secondarycolour',
    nullable: true,
    default: null,
    length: 255,
  })
  secondarycolour: string | null;

  @OneToOne(() => Record, { eager: true })
  @JoinColumn()
  logo: Record | null;

  @Exclude()
  @Column('text', { name: 'appsettings', nullable: true, default: null })
  appsettings: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'bundleid',
    nullable: true,
    default: null,
    length: 255,
  })
  bundleid: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'appuniversallink',
    nullable: true,
    default: null,
    length: 255,
  })
  appuniversallink: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'appstoreid',
    nullable: true,
    default: null,
    length: 255,
  })
  appstoreid: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'androidpackageid',
    nullable: true,
    default: null,
    length: 255,
  })
  androidpackageid: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'appleappstorelink',
    nullable: true,
    default: null,
    length: 255,
  })
  appleappstorelink: string | null;

  @Exclude()
  @Column('varchar', {
    name: 'androidappstorelink',
    nullable: true,
    default: null,
    length: 255,
  })
  androidappstorelink: string | null;

  @Exclude()
  @Column('text', { name: 'enabledmodules', nullable: true, default: null })
  enabledmodules: string | null;

  @Column('varchar', {
    name: 'tertiaryColour',
    nullable: true,
    default: null,
    length: 255,
  })
  tertiaryColour: string | null;

  @Column('text', { name: 'privacypolicy', nullable: true, default: null })
  privacypolicy: string | null;

  @Column('text', { name: 'readmoretext', nullable: true, default: null })
  readmoretext: string | null;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  public: boolean;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  contentIsPublic: boolean | null;

  @Exclude()
  @Column('varchar', {
    name: 'emailToSendNotifications',
    nullable: true,
    default: null,
    length: 255,
  })
  emailToSendNotifications: string | null;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  sharedAppOwner: boolean;

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  hasCustomApp: boolean;

  @Column('varchar', {
    name: 'addressLineOne',
    nullable: true,
    default: null,
    length: 150,
  })
  addressLineOne: string | null;

  @Column('varchar', {
    name: 'addressLineTwo',
    nullable: true,
    default: null,
    length: 150,
  })
  addressLineTwo: string | null;

  @Column('varchar', {
    name: 'postcode',
    nullable: true,
    default: null,
    length: 10,
  })
  postcode: string | null;

  @Column('varchar', {
    name: 'city',
    nullable: true,
    default: null,
    length: 150,
  })
  city: string | null;

  @Column('varchar', {
    name: 'customdomain',
    nullable: true,
    default: null,
    length: 40,
  })
  customdomain: string | null;

  @Exclude()
  @Column('int', { name: 'subscription', nullable: true, default: null })
  subscription: number | null;

  @Column('boolean', { name: 'active', nullable: true, default: null })
  active: boolean | null;

  @OneToMany(
    () => OrganisationContractor,
    (OrganisationContractor) => OrganisationContractor.organisationModel,
    { eager: true, cascade: true },
  )
  contractors: OrganisationContractor[];

  @OneToMany(() => Area, (Area) => Area.organisationModel, {
    eager: true,
    cascade: true,
  })
  areas: Area[];

  @OneToMany(() => Role, (role) => role.organisationModel)
  roles: Role[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin' })
  adminModel: User | null;
  @Column({ nullable: true })
  admin: string | null;

  @ManyToMany(() => User, (user) => user.organisations)
  @JoinTable()
  users: User[];

  @Exclude()
  @Column('boolean', {
    default: false,
  })
  hassites: boolean;

  @Exclude()
  @Column('int', {
    name: 'numallowedusers',
    nullable: true,
    default: () => "'1000'",
  })
  numallowedusers: number | null;

  @Exclude()
  @Column('text', { name: 'notes', nullable: true, default: null })
  notes: string | null;

  @Column('text', { nullable: true })
  projectNumber: string;

  @Column('text', { nullable: true })
  projectLocation: string;

  @Column('timestamp', { nullable: true })
  projectStartDate: Date;

  @Column('timestamp', { nullable: true })
  projectEndDate: Date;

  @Column('text', { nullable: true })
  projectPhase: string;

  @Column('jsonb', { nullable: true })
  enabledKPIs: TransAtKPIListDTO[];

  @Column('int', { nullable: false, default: 1000000 })
  kpiMultiplier: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  LTIRMin: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 2.7 })
  LTIRMax: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  TRIRMin: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 3.5 })
  TRIRMax: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  DARTMin: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1.5 })
  DARTMax: number;
}

export class TransAtKPIListDTO {
  @IsString()
  id: string;
  @IsString()
  displayName: string;
  @IsString()
  @IsOptional()
  originalDisplayName?: string;
  @IsString()
  @IsOptional()
  contractorReportId?: string;
  @IsString()
  @IsOptional()
  contractorId?: string;
  @IsString()
  @IsOptional()
  contractorName?: string;
  @IsBoolean()
  enabled: boolean;
}

export class OrganisationDTO extends ApptBaseDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  primarycolour?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  secondarycolour?: string | null;

  @IsString()
  @IsOptional()
  appsettings?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  bundleid?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  appuniversallink?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  appstoreid?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  androidpackageid?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  appleappstorelink?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  androidappstorelink?: string | null;

  @IsString()
  @IsOptional()
  enabledmodules?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  tertiaryColour?: string | null;

  @IsString()
  @IsOptional()
  privacypolicy?: string | null;

  @IsString()
  @IsOptional()
  readmoretext?: string | null;

  @IsBoolean()
  @IsOptional()
  public?: boolean | null;

  @IsBoolean()
  @IsOptional()
  contentIsPublic?: boolean | null;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  emailToSendNotifications?: string | null;

  @IsBoolean()
  @IsOptional()
  sharedAppOwner?: boolean | null;

  @IsBoolean()
  @IsOptional()
  hasCustomApp?: boolean | null;

  @IsString()
  @IsOptional()
  @Length(0, 150)
  addressLineOne?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 150)
  addressLineTwo?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 10)
  postcode?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 150)
  city?: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 40)
  customdomain?: string | null;

  @IsNumber()
  @IsOptional()
  subscription?: number | null;

  @IsOptional()
  @IsUUID()
  admin?: string | null;

  @IsBoolean()
  @IsOptional()
  hassites?: boolean | null;

  @IsOptional()
  @IsNumber()
  numallowedusers?: number | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsString()
  projectNumber?: string;

  @IsOptional()
  @IsString()
  projectLocation?: string;

  @IsOptional()
  @IsDateString()
  projectStartDate?: Date;

  @IsOptional()
  @IsDateString()
  projectEndDate?: Date;

  @IsOptional()
  @IsString()
  projectPhase?: string;

  @IsOptional()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TransAtKPIListDTO)
  enabledKPIs?: TransAtKPIListDTO[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  LTIRMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  LTIRMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TRIRMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TRIRMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  DARTMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  DARTMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  kpiMultiplier?: number;
}

export class TransAtOrgDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => OrganisationDTO)
  organisation: OrganisationDTO;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  newContractors: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  newAreas: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  kpiUsers: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  HSEUsers: string[];
}

export class TransAtOrgUpdateDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => OrganisationDTO)
  organisation: OrganisationDTO;

  @IsOptional()
  @Type(() => AreaDTO)
  @ValidateNested({ each: true })
  areas: AreaDTO[];

  @IsOptional()
  @Type(() => OrganisationContractorDTO)
  @ValidateNested({ each: true })
  contractors: OrganisationContractorDTO[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  newKpiUsers: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  newHseUsers: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  deletedUsersIds: string[];
}
