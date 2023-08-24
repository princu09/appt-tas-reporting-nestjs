import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailTemplate } from '../email-template.entity';

@Entity('email-template-trigger-delayed')
export class EmailTemplateTriggerDelayed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  email: string;

  @Column('timestamp')
  timeToSend: Date;

  @OneToOne(() => EmailTemplate, { eager: true })
  @JoinColumn()
  template: EmailTemplate;
}
