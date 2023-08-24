import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Record } from '../record/record.entity';
import { EmailTemplate } from './email-template.entity';

@Entity('email-template-attachments')
export class EmailTemplateAttachments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Record, { eager: true })
  @JoinColumn({ name: 'recordId' })
  record: Record;
  @Column({ nullable: false })
  recordId: string | null;

  @ManyToOne(() => EmailTemplate, (eta) => eta.attachments)
  emailTemplate: EmailTemplate;
  @Column({ nullable: false })
  emailTemplateId: string | null;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
