import { IsOptional, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Usergroup } from '../user-group/user-group.entity';

@Entity('usergroupmember')
export class Usergroupmember extends ApptBaseEntity {
  @ManyToOne(() => Usergroup)
  @JoinColumn({ name: 'usergroup' })
  usergroupModel: Usergroup;
  @Column()
  usergroup: string;
}

export class UsergroupmemberDTO {
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
