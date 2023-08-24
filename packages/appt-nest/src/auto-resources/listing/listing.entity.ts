import { Json } from 'aws-sdk/clients/robomaker';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Record } from '../record/record.entity';

@Entity('listing')
export class Listing extends ApptBaseEntity {
  @Column({ nullable: true })
  addressLine1: string;
  @Column({ nullable: true })
  addressLine2: string;
  @Column({ nullable: true })
  postCode: string;
  @Column({ nullable: true })
  city: string;
  @Column('money', { nullable: true })
  cost_pppw: number;
  @Column({ nullable: true })
  bedroomCount: number;
  @Column({ nullable: true })
  briefDescription: string;
  @Column({ nullable: true })
  fullDescription: string;
  @Column({ nullable: true })
  agentContactNumber: string;
  @Column('money', { nullable: true })
  holdingFee: number;
  @Column({ default: false })
  isLive: boolean;
  @Column({ default: false })
  billsIncluded: boolean;
  @Column({ default: false })
  reserved: boolean;
  @Column({ nullable: true })
  contractLength: number;
  @Column({ nullable: true })
  availableFrom: Date;
  @Column({ nullable: true })
  keyFeatures: Json;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  locationSummary: string;
  @Column({ nullable: true })
  latitude: number;
  @Column({ nullable: true })
  longitude: number;
  @Column({ nullable: true })
  floorplanURL: string;
  @Column({ nullable: true })
  videoURL: string;
  @Column({ nullable: true })
  epcURL: string;

  @ManyToOne(() => Record, { eager: true })
  @JoinTable()
  listingMedia: Record[];
}

export class ListingDTO {
  @IsOptional()
  addressLine1: string;

  @IsOptional()
  addressLine2: string;

  @IsOptional()
  postCode: string;

  @IsOptional()
  city: string;

  @IsOptional()
  cost_pppw: number;

  @IsOptional()
  @IsInt()
  bedroomCount: number;

  @IsOptional()
  briefDescription: string;

  @IsOptional()
  fullDescription: string;

  @IsOptional()
  agentContactNumber: string;

  @IsOptional()
  holdingFee: number;

  @IsOptional()
  isLive: boolean;

  @IsOptional()
  billsIncluded: boolean;

  @IsOptional()
  reserved: boolean;

  @IsOptional()
  contractLength: number;

  @IsOptional()
  @IsDateString()
  availableFrom: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  keyFeatures: string;

  @IsOptional()
  name: string;

  @IsOptional()
  locationSummary: string;

  @IsOptional()
  @IsLatitude()
  latitude: number;

  @IsOptional()
  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsUrl()
  floorplanURL: string;

  @IsOptional()
  @IsUrl()
  videoURL: string;

  @IsOptional()
  @IsUrl()
  epcURL: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  @IsArray()
  listingMedia: string[];

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
