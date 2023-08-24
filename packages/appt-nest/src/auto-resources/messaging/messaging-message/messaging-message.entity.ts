import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApptBaseEntity } from '../../../base/appt-base-entity';
import { MessagingConversation } from '../messaging-conversation/messaging-conversation.entity';

@Entity('messagingmessage')
export class MessagingMessage extends ApptBaseEntity {
  @Column('text', { name: 'message', nullable: true, default: null })
  message: string | null;

  @ManyToOne(() => MessagingConversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation' })
  conversationModel: MessagingConversation;
  @Column()
  conversation: string;
}

export class MessagingMessageDTO {
  @IsString()
  message: string | null;

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
