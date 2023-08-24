import { IsOptional, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Usergroup } from '../user-group/user-group.entity';

@Entity('usergroupadmin')
export class Usergroupadmin extends ApptBaseEntity {
  @ManyToOne(() => Usergroup)
  @JoinColumn({ name: 'usergroup' })
  usergroupModel: Usergroup;
  @Column()
  usergroup: string;
}

export class UsergroupadminDTO {
  @IsUUID()
  usergroup: string;

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
