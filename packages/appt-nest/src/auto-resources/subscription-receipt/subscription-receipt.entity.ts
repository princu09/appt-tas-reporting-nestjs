import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Subscription } from '../subscription/subscription.entity';

@Entity('subscriptionreceipt')
export class Subscriptionreceipt extends ApptBaseEntity {
  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription' })
  subscriptionModel: Subscription;
  @Column()
  subscription: string;

  @Column('varchar', {
    name: 'provider',
    nullable: true,
    default: null,
    length: 255,
  })
  provider: string | null;

  @Column('varchar', {
    name: 'reference',
    nullable: true,
    default: null,
    length: 255,
  })
  reference: string | null;
}

export class SubscriptionreceiptDTO {
  @IsUUID()
  subscription: string;

  @IsOptional()
  @IsString()
  provider: string | null;

  @IsOptional()
  @IsString()
  reference: string | null;

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
