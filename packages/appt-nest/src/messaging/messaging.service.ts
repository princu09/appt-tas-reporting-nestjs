import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessagingConversationService } from 'src/auto-resources/messaging/messaging-conversation/messaging-conversation.service';
import { MessagingMessage } from 'src/auto-resources/messaging/messaging-message/messaging-message.entity';
import { MessagingMessageService } from 'src/auto-resources/messaging/messaging-message/messaging-message.service';
import { User } from 'src/auto-resources/user/user.entity';
import { UserService } from 'src/auto-resources/user/user.service';
import { In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { MessagingAddUser } from './dtos/add-user.dto';
import { MessagingGetMessages } from './dtos/get-messages.dto';
import { MessagingListen } from './dtos/listen-conversation.dto';
import { MessagingNewMessage } from './dtos/new-message.dto';
import { MessagingRemoveUser } from './dtos/remove-user.dto';
import { MessagingStartConversation } from './dtos/start-conversation.dto';

export class MessagingConversationData {
  messages: MessagingMessage[];
  chatters: MessagingChattersData[];
  conversation: { id: string; name: string };
}

export class MessagingNewConversation {
  conversation: MessagingConversationData;
  errors: MessagingErrors;
}

export class MessagingErrors {
  errors: string[] = [];
}

export class MessagingChattersData {
  id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
}

@Injectable()
export class MessagingService {
  constructor(
    private userService: UserService,
    private conversationService: MessagingConversationService,
    private messageService: MessagingMessageService,
  ) {}

  getConversationRoomID(id: string) {
    return `msg-${id}`;
  }

  private async getChatterData(
    userIds: string[],
  ): Promise<MessagingChattersData[]> {
    return (await this.userService.find({
      where: { id: In(userIds) },
      select: ['id', 'firstname', 'lastname', 'mobile', 'email'],
    })) as MessagingChattersData[];
  }

  private extractUserData(users: User[]): MessagingChattersData[] {
    const ret = [];

    for (const user of users) {
      ret.push({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile: user.mobile,
        email: user.email,
      });
    }

    return ret;
  }

  async listenToConversation(
    data: MessagingListen,
    socket: Socket,
    startListening = true,
  ): Promise<MessagingConversationData | null> {
    if (!data.conversationID) throw new WsException('Missing conversationID');

    const convo = await this.conversationService.findOne(data.conversationID, {
      relations: ['chatters'],
    });
    if (!convo) throw new WsException('No matching conversationID');

    if (!convo.chatters.find((x) => x.id === data.requestUserId))
      throw new WsException('You are not part of this conversation');

    if (startListening) {
      await socket.join(this.getConversationRoomID(convo.id));
      const messages = await this.messageService.find({
        where: {
          conversation: data.conversationID,
        },
        order: {
          createdAt: 'DESC',
        },
        take: 30,
      });

      return {
        messages: messages,
        chatters: this.extractUserData(convo.chatters),
        conversation: {
          id: convo.id,
          name: convo.name,
        },
      };
    } else {
      await socket.leave(this.getConversationRoomID(convo.id));
    }
  }

  async startConversation(
    data: MessagingStartConversation,
    socket: Socket,
  ): Promise<MessagingNewConversation> {
    const errors = new MessagingErrors();
    const chatters = data.chatters;
    delete data.chatters;

    // Create the conversation
    const convo = await this.conversationService.getRepo().save({
      name: data.name,
      owner: data.requestUserId,
      organisation: data.orgId,
      site: data.siteId,
    });

    // Create the chatters for the conversation if any sent
    await this.conversationService.addUser(data.requestUserId, convo.id);
    for (const chatter of chatters) {
      try {
        await this.conversationService.addUser(chatter, convo.id);
      } catch (err) {
        errors.errors.push(`Failed to add chatter to conversation`);
      }
    }

    // Return errors or just empty JSON
    return {
      conversation: await this.listenToConversation(
        { ...data, conversationID: convo.id },
        socket,
      ),
      errors: errors,
    };
  }

  async addUserToConvo(
    data: MessagingAddUser,
    socket: Socket,
  ): Promise<MessagingErrors> {
    const convo = await this.conversationService.findOne(data.conversationID);
    if (!convo) throw new WsException('Invalid conversationID');
    if (convo.owner !== data.requestUserId)
      throw new WsException('Only the conversation owner can add new users');

    const errors = new MessagingErrors();
    for (const userId of data.userIds) {
      try {
        await this.conversationService.addUser(userId, convo.id);
      } catch (err) {
        errors.errors.push(`Failed to add user ${userId}`);
      }
    }

    socket
      .to(this.getConversationRoomID(data.conversationID))
      .emit('user-added', await this.getChatterData(data.userIds));

    return errors;
  }

  async removeUser(data: MessagingRemoveUser, socket: Socket) {
    if (
      data.userId === data.requestUserId ||
      (await this.conversationService.count({
        owner: data.requestUserId,
        id: data.conversationID,
      }))
    ) {
      await this.conversationService.removeUser(
        data.conversationID,
        data.userId,
      );
      socket
        .to(this.getConversationRoomID(data.conversationID))
        .emit('user-removed', data.userId);
    } else {
      throw new WsException(
        `You can only remove your self from conversations, or other users if you are the conversation owner.`,
      );
    }

    return {};
  }

  async newMessage(data: MessagingNewMessage, socket: Socket) {
    // Check user in conversation
    const convo = await this.conversationService.findOne(data.conversationID, {
      relations: ['chatters'],
    });
    const inConvo = convo.chatters.find((x) => x.id === data.requestUserId);
    if (!inConvo)
      throw new WsException('You are not part of this conversation');

    const message = await this.messageService.getRepo().save({
      message: data.message,
      conversation: data.conversationID,
      owner: data.requestUserId,
      organisation: data.orgId,
      site: data.siteId,
    });

    socket
      .to(this.getConversationRoomID(data.conversationID))
      .emit('message', message);

    return message;
  }

  async getMessages(data: MessagingGetMessages) {
    const convo = await this.conversationService.findOne(data.conversationID, {
      relations: ['chatters'],
    });
    const inConvo = convo.chatters.find((x) => x.id === data.requestUserId);
    if (!inConvo)
      throw new WsException('You are not part of this conversation');

    return await this.messageService.find({
      ...(data.take && { take: data.take }),
      ...(data.skip && { skip: data.skip }),
      where: {
        ...(data.dateFrom && { createdAt: MoreThanOrEqual(data.dateFrom) }),
        ...(data.dateTo && { createdAt: LessThanOrEqual(data.dateTo) }),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
