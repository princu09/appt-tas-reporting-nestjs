import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IOrganisation } from '../auto-resources/organisation/organisation.entity';
import { ISite } from '../auto-resources/site/site.entity';
import { IUser } from '../auto-resources/user/user.entity';

export abstract class ApptBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User')
  @JoinColumn({ name: 'owner' })
  ownerModel: IUser;
  @Column()
  owner: string;

  @ManyToOne('Organisation')
  @JoinColumn({ name: 'organisation' })
  organisationModel?: IOrganisation;
  @Column()
  organisation: string;

  @ManyToOne('Site')
  @JoinColumn({ name: 'site' })
  siteModel: ISite | null;
  @Column({ nullable: true })
  site: string | null;
}

export abstract class ApptBaseEntityDeleteOrphan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User', { orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'owner' })
  ownerModel: IUser;
  @Column()
  owner: string;

  @ManyToOne('Organisation')
  @JoinColumn({ name: 'organisation' })
  organisationModel?: IOrganisation;
  @Column()
  organisation: string;

  @ManyToOne('Site')
  @JoinColumn({ name: 'site' })
  siteModel: ISite | null;
  @Column({ nullable: true })
  site: string | null;
}

export abstract class ApptBaseEntityNullable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('User')
  @JoinColumn({ name: 'owner' })
  ownerModel: IUser;
  @Column({ nullable: true })
  owner: string;

  @ManyToOne('Organisation')
  @JoinColumn({ name: 'organisation' })
  organisationModel: IOrganisation;
  @Column({ nullable: true })
  organisation: string;

  @ManyToOne('Site')
  @JoinColumn({ name: 'site' })
  siteModel: ISite | null;
  @Column({ nullable: true })
  site: string | null;
}
