import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../base/appt-base-entity';
import { Subscription } from '../subscription/subscription.entity';

@Entity('order')
export class Order extends ApptBaseEntity {
  @Column('varchar', {
    name: 'status',
    nullable: true,
    default: null,
    length: 10,
  })
  status: string | null;

  @Column('varchar', {
    name: 'intentId',
    nullable: true,
    default: null,
    length: 255,
  })
  intentId: string | null;

  @Column('varchar', {
    name: 'clientSecret',
    nullable: true,
    default: null,
    length: 255,
  })
  clientSecret: string | null;

  @Column('text', { name: 'fullStripeIntent', nullable: true, default: null })
  fullStripeIntent: string | null;

  @Column('int', { name: 'paymentAmount', nullable: true, default: null })
  paymentAmount: number | null;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription' })
  subscriptionModel: Subscription;
  @Column()
  subscription: string;
}

export class OrderDTO {
  @IsOptional()
  @IsString()
  status: string | null;

  @IsOptional()
  @IsString()
  intentId: string | null;

  @IsOptional()
  @IsString()
  clientSecret: string | null;

  @IsOptional()
  @IsString()
  fullStripeIntent: string | null;

  @IsOptional()
  @IsNumber()
  paymentAmount: number | null;

  @IsUUID()
  subscription: number | null;

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
