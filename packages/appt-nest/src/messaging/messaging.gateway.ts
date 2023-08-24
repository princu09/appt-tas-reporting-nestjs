import {
  Logger,
  SetMetadata,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketExceptionFilter } from 'src/filters/websocket-exception.filter';
import { WSUserHasPermissionGuard } from 'src/guards/websocket-user-has-permission.guard';
import { WebSocketGuard } from 'src/guards/websocket.guard';
import { MessagingAddUser } from './dtos/add-user.dto';
import { MessagingGetMessages } from './dtos/get-messages.dto';
import { MessagingListen } from './dtos/listen-conversation.dto';
import { MessagingNewMessage } from './dtos/new-message.dto';
import { MessagingRemoveUser } from './dtos/remove-user.dto';
import { MessagingStartConversation } from './dtos/start-conversation.dto';
import { MessagingPermissions } from './messaging.permissions';
import { MessagingService } from './messaging.service';

@WebSocketGateway({ namespace: 'messaging' })
@UseGuards(WebSocketGuard)
@UsePipes(ValidationPipe)
@UseFilters(WebsocketExceptionFilter)
export class MessagingGateway {
  private logger: Logger = new Logger(MessagingGateway.name);
  @WebSocketServer() server: Server;

  constructor(public messagingService: MessagingService) {}

  @SubscribeMessage('listen')
  @SetMetadata('permissions', [MessagingPermissions.BASIC])
  @UseGuards(WSUserHasPermissionGuard)
  async listen(
    @MessageBody() data: MessagingListen,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.messagingService.listenToConversation(data, client);
  }

  @SubscribeMessage('stop-listening')
  @SetMetadata('permissions', [MessagingPermissions.BASIC])
  @UseGuards(WSUserHasPermissionGuard)
  async stopListening(
    @MessageBody() data: MessagingListen,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.messagingService.listenToConversation(
      data,
      client,
      false,
    );
  }

  @SubscribeMessage('start-conversation')
  @SetMetadata('permissions', [MessagingPermissions.MODERATOR])
  @UseGuards(WSUserHasPermissionGuard)
  @ApiOperation({
    summary: `Starts a messaging conversation, adds the chatters userids to the conversation.
  This will also automatically start listening to the newly created conversation`,
  })
  async startConversation(
    @MessageBody() data: MessagingStartConversation,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagingService.startConversation(data, client);
  }

  @SubscribeMessage('add-user')
  @SetMetadata('permissions', [MessagingPermissions.MODERATOR])
  @UseGuards(WSUserHasPermissionGuard)
  @ApiOperation({
    summary: `Add users to the conversation also emits the 'user-added' event along with data type MessagingChattersData.`,
  })
  async addUser(
    @MessageBody() data: MessagingAddUser,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagingService.addUserToConvo(data, client);
  }

  @SubscribeMessage('remove-user')
  @SetMetadata('permissions', [MessagingPermissions.BASIC])
  @UseGuards(WSUserHasPermissionGuard)
  async removeUser(
    @MessageBody() data: MessagingRemoveUser,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagingService.removeUser(data, client);
  }

  @SubscribeMessage('new-message')
  @SetMetadata('permissions', [MessagingPermissions.BASIC])
  @UseGuards(WSUserHasPermissionGuard)
  @ApiOperation({
    summary: `Creates a new message emits the 'message' event along with data type MessagingMessage`,
  })
  async newMessage(
    @MessageBody() data: MessagingNewMessage,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagingService.newMessage(data, client);
  }

  @SubscribeMessage('messages')
  @SetMetadata('permissions', [MessagingPermissions.BASIC])
  @UseGuards(WSUserHasPermissionGuard)
  async getMessages(@MessageBody() data: MessagingGetMessages) {
    return this.messagingService.getMessages(data);
  }
}
