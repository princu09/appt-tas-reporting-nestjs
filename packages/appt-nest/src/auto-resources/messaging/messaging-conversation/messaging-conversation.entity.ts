import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../../auto-resources/user/user.entity';
import { ApptBaseEntity } from '../../../base/appt-base-entity';
import { MessagingMessage } from '../messaging-message/messaging-message.entity';

@Entity('messagingconversation')
export class MessagingConversation extends ApptBaseEntity {
  @Column('varchar', {
    name: 'name',
    nullable: true,
    default: null,
    length: 1024,
  })
  name: string | null;

  @OneToMany(() => MessagingMessage, (mm) => mm.conversation)
  messages: MessagingMessage[];

  @ManyToMany(() => User, (u) => u.messagingConversations)
  @JoinTable()
  chatters: User[];
}

export class MessagingConversationDTO {
  @IsOptional()
  @IsString()
  name: string | null;

  @IsOptional()
  @IsUUID()
  owner: string | null;

  @IsOptional()
  @IsUUID()
  organisation: string | null;

  @IsOptional()
  @IsUUID()
  site: string | null;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  chatters: string[];
}
