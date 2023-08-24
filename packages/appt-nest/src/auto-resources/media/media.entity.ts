import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { RelationDTO } from '../../helper/relation-dto.dto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { MediaRestriction } from '../media-restriction/media-restriction.entity';
import { Record } from '../record/record.entity';

@Entity()
@Tree('closure-table')
export class Media extends ApptBaseEntity {
  @Column({ nullable: true })
  colorHex: string | null;

  @Column({ nullable: true })
  color: string | null;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  authorUrl: string | null;

  @Column({ nullable: true })
  authorImageUrl: string | null;

  @Column({ nullable: true })
  featuredImageUrl: string | null;

  @Column({ nullable: true, default: 0 })
  sort: number | null;

  @Column({ default: false })
  public: boolean;

  @Column({ default: false })
  published: boolean;

  @Column({ nullable: true })
  author: string | null;

  @Column({ nullable: true })
  title: string | null;

  @Column('jsonb', { nullable: true })
  icon: string | null;

  @JoinColumn({ name: 'recordId' })
  @OneToOne(() => Record, { nullable: true, onDelete: 'SET NULL' })
  record: Record | null;
  @Column({ nullable: true })
  recordId: string | null;

  @TreeChildren()
  children: Media[];

  @TreeParent()
  parent: Media;

  @OneToMany(() => MediaRestriction, (mpr) => mpr.media, { eager: true })
  mediaRestriction: MediaRestriction[];
}

export class MediaDTO {
  @IsString()
  @IsOptional()
  author: string | null;
  @IsString()
  @IsOptional()
  title: string | null;
  @IsString()
  @IsOptional()
  icon: string | null;
  @IsString()
  @IsOptional()
  colorHex: string | null;
  @IsString()
  @IsOptional()
  color: string | null;
  @IsString()
  @IsOptional()
  description: string | null;
  @IsString()
  @IsOptional()
  authorUrl: string | null;
  @IsOptional()
  @IsString()
  authorImageUrl: string | null;
  @IsOptional()
  @IsString()
  featuredImageUrl: string | null;
  @IsOptional()
  @IsNumber()
  sort: number | null;

  @IsOptional()
  public: boolean;

  @IsOptional()
  published: boolean;

  @IsOptional()
  @Type(() => RelationDTO)
  record: RelationDTO;

  @IsOptional()
  @IsUUID()
  recordId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationDTO)
  @IsArray()
  children: RelationDTO[];

  @IsOptional()
  @Type(() => RelationDTO)
  parent: RelationDTO;

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
