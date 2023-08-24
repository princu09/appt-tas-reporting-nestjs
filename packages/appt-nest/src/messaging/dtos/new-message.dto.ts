import { WebsocketDataBase } from './websocket-base.dto';

export class MessagingNewMessage extends WebsocketDataBase {
  conversationID: string;
  message: string;
}
