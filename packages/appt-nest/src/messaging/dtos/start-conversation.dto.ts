import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';
import { WebsocketDataBase } from './websocket-base.dto';

export class MessagingStartConversation extends WebsocketDataBase {
  name: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'A list of user ids that you want to add to the conversation',
  })
  chatters: string[];
}
