import { IsOptional, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { User } from '../user/user.entity';

@Entity('userdirectaccess')
export class Userdirectaccess extends ApptBaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetuser' })
  targetuserModel: User;
  @Column()
  targetuser: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usergrantedaccess' })
  usergrantedaccessModel: User;
  @Column()
  usergrantedaccess: string;
}

export class UserdirectaccessDTO {
  @IsUUID()
  targetuser: string;

  @IsUUID()
  usergrantedaccess: string;

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
