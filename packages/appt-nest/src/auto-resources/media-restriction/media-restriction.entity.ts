import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { RelationDTO } from '../../helper/relation-dto.dto';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Media } from '../media/media.entity';
import { Role } from '../role/role.entity';
import { Subscription } from '../subscription/subscription.entity';
import { User } from '../user/user.entity';

@Entity('MediaRestriction')
export class MediaRestriction extends ApptBaseEntity {
  @ManyToOne(() => Media, (media) => media.mediaRestriction, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  media: Media;
  @Column()
  mediaId: string;

  @OneToOne(() => Subscription, { nullable: true })
  @JoinColumn()
  subscription: Subscription | null;
  @Column('uuid', { nullable: true })
  subscriptionId: string | null;

  @OneToOne(() => Role, { nullable: true })
  @JoinColumn()
  role: Role | null;
  @Column('uuid', { nullable: true })
  roleId: string | null;

  @OneToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'userDeniedId ' })
  userDenied: User | null;
}

export class MediaRestrictionDTO {
  @IsOptional()
  @Type(() => RelationDTO)
  media: RelationDTO;
  @IsOptional()
  @IsUUID()
  mediaId: string;

  @IsOptional()
  @Type(() => RelationDTO)
  role: RelationDTO;
  @IsOptional()
  @IsUUID()
  roleId: string;

  @IsOptional()
  @Type(() => RelationDTO)
  subscription: RelationDTO;
  @IsOptional()
  @IsUUID()
  subscriptionId: string;

  @IsOptional()
  @Type(() => RelationDTO)
  userDenied: RelationDTO;
  @IsOptional()
  @IsUUID()
  userDeniedId: string;

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
