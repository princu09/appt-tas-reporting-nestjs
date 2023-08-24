import { WebsocketDataBase } from './websocket-base.dto';

export class MessagingAddUser extends WebsocketDataBase {
  conversationID: string;
  userIds: string[];
}
