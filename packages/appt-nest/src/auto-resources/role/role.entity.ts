import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Roleuser } from '../role-user/role-user.entity';

@Entity('role')
export class Role extends ApptBaseEntity {
  @Column('varchar', {
    name: 'title',
    nullable: true,
    default: null,
    length: 255,
  })
  title: string | null;

  @Column('text', { array: true, default: [] })
  permissions: string[] | null;

  @Column('boolean', { name: 'defaultrole', nullable: true, default: null })
  defaultrole: boolean | null;

  @Column('boolean', { name: 'hidden', nullable: true, default: null })
  hidden: boolean | null;

  @OneToMany(() => Roleuser, (r) => r.roleModel)
  roleUsers: Roleuser[];
}

export class RoleDTO {
  @IsOptional()
  @IsString()
  title: string | null;

  @IsOptional()
  @IsArray()
  permissions: string[] | null;

  @IsOptional()
  @IsBoolean()
  defaultrole: boolean | null;

  @IsOptional()
  @IsBoolean()
  hidden: boolean | null;

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
