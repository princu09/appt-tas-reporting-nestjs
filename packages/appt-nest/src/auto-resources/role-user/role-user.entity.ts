import { IsOptional, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntityDeleteOrphan } from '../../base/appt-base-entity';
import { Role } from '../role/role.entity';

@Entity('roleuser')
export class Roleuser extends ApptBaseEntityDeleteOrphan {
  @ManyToOne(() => Role, (role) => role.roleUsers, { eager: true })
  @JoinColumn({ name: 'role' })
  roleModel: Role;
  @Column('uuid')
  role: string;
}

export class RoleuserDTO {
  @IsUUID()
  role: string;

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
