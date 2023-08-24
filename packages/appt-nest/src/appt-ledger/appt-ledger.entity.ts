import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('apptledger')
export class ApptLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  cost: number;

  @Column('boolean', { default: true })
  outstanding: boolean;

  @Column('text', { nullable: true })
  stripeTransferID: string | null;

  @Column('text', { nullable: true })
  stripeIntentID: string | null;

  @ApiProperty({
    description:
      'If it has rolled over then this no longer needs to be paid. They get rolled over when a new appt ledger cron runs.',
  })
  @Column('boolean', { default: false })
  rolledover: boolean;

  @Column('timestamp', { nullable: true, default: null })
  receivedAt: Date | null;

  @ManyToOne('Organisation', { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'organisation' })
  organisationModel: Organisation;
  @Column()
  organisation: string;
}
