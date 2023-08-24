import { WebsocketDataBase } from './websocket-base.dto';

export class MessagingRemoveUser extends WebsocketDataBase {
  conversationID: string;
  userId: string;
}
