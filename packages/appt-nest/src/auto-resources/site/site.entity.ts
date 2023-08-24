import { IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organisation } from '../organisation/organisation.entity';
import { User } from '../user/user.entity';

export interface ISite {
  id: string;
}

@Entity('site')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 255,
  })
  name: string | null;

  @Column('text', { name: 'notes', nullable: true, default: null })
  notes: string | null;

  @Column('varchar', {
    name: 'address',
    nullable: true,
    default: null,
    length: 255,
  })
  address: string | null;

  @Column('varchar', {
    name: 'postcode',
    nullable: true,
    default: null,
    length: 255,
  })
  postcode: string | null;

  @Column('varchar', {
    name: 'city',
    nullable: true,
    default: null,
    length: 255,
  })
  city: string | null;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner' })
  ownerModel: User;
  @Column()
  owner: string;

  @ManyToOne(() => Organisation)
  @JoinColumn({ name: 'organisation' })
  organisationModel: Organisation;
  @Column()
  organisation: string;
}

export class SiteDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsString()
  notes: string | null;

  @IsOptional()
  @IsString()
  address: string | null;

  @IsOptional()
  @IsString()
  postcode: string | null;

  @IsOptional()
  @IsString()
  city: string | null;
}
