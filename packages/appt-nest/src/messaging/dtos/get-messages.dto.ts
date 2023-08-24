import { WebsocketDataBase } from './websocket-base.dto';

export class MessagingGetMessages extends WebsocketDataBase {
  conversationID: string;
  dateFrom: string | null;
  dateTo: string | null;
  take: number | null;
  skip: number | null;
}
