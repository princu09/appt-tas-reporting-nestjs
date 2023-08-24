import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { io, Socket } from 'socket.io-client';
import { MessagingConversation } from 'src/auto-resources/messaging/messaging-conversation/messaging-conversation.entity';
import { MessagingMessage } from 'src/auto-resources/messaging/messaging-message/messaging-message.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { MessagingListen } from 'src/messaging/dtos/listen-conversation.dto';
import { MessagingPermissions } from 'src/messaging/messaging.permissions';
import { MessagingConversationData, MessagingNewConversation } from 'src/messaging/messaging.service';
import { Repository } from 'typeorm';
import { down, up } from './e2eHelpers';
import { UserFactory, UserFactoryReturn } from './factories/user.factory';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe.skip('messaging', () => {
  let app: INestApplication;
  let userPerms: UserFactoryReturn;
  let userBasicPerms : UserFactoryReturn;
  let userNotInConvo : UserFactoryReturn;
  let userNoPerms : UserFactoryReturn;
  let userFactory: UserFactory;
  let conversationRepo: Repository<MessagingConversation>

  jest.setTimeout(30000);
  beforeAll(async function () {
    ({ app, userFactory } = await up())

    userPerms = await userFactory.addData({
      email: 'alex.taylor@appt.digital',
      username: 'test',
      mobile: '+447484353311',
    })
      .addPermissions([
        MessagingPermissions.MODERATOR,
        MessagingPermissions.BASIC,
      ])
      .create()

      userNotInConvo = await userFactory.addData({
      email: 'alex.taylor1@appt.digital',
      username: 'test1',
      mobile: '+447484353311',
    })
      .addPermissions([
        MessagingPermissions.MODERATOR,
        MessagingPermissions.BASIC,
      ])
      .setOrganisation(userPerms.organisation)
      .create()

    userNoPerms = await userFactory.addData({
      email: 'alex.taylor2@appt.digital',
      username: 'test2',
      mobile: '+447484353311',
    })
      .addPermissions([
      ])
      .setOrganisation(userPerms.organisation)
      .create()

    userBasicPerms = await userFactory.addData({
      email: 'alex.taylor3@appt.digital',
      username: 'test3',
      mobile: '+447484353311',
    })
      .addPermissions([
        MessagingPermissions.BASIC,
      ])
      .setOrganisation(userPerms.organisation)
      .create()

    conversationRepo = app.get(getRepositoryToken(MessagingConversation))
  })
  afterAll(async () => {
    await down(app);
  })

  const getConnection = (token: string) => {
    return io('ws://localhost:3000/messaging', {
      reconnectionDelay: 0,
      forceNew: true,
      extraHeaders: {
        'authorization': token
      }
    });
  }

  it('BadApiToken', (done) => {
    const io = getConnection(userBasicPerms.apiToken+'1')
    io.on('exception', (err) => {
      expect(err.message).toEqual('Invalid authorization token')
      io.disconnect()
      return done()
    })
    io.on('connect', () => {
     io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      })
    })
  })

  it('NoOrg', (done) => {
    const io = getConnection(userBasicPerms.apiToken)
    io.on('exception', (err) => {
      expect(err.message).toEqual('Missing orgId query parameter')
      io.disconnect()
      return done()
    })
    io.on('connect', () => {
     io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id]
      })
    })
  })

  it('InvalidOrg', (done) => {
    const io = getConnection(userBasicPerms.apiToken)
    io.on('exception', (err) => {
      expect(err.message).toEqual('Invalid orgId parameter')
      io.disconnect()
      return done()
    })
    io.on('connect', () => {
     io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: '123'
      })
    })
  })

  it('permissionsBasic', (done) => {
    const io = getConnection(userBasicPerms.apiToken)
    io.on('exception', (err) => {
      expect(err.message).toEqual('Forbidden resource')
      io.disconnect()
      return done()
    })
    io.on('connect', () => {
     io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      })
    })
  })

  it('startConversation', (done) => {
    const io = getConnection(userPerms.apiToken)
    io.on('connect', () => {
      io.on('exception', (err) => {
        expect(err.message).toEqual('Forbidden resource')
        return done()
      })
      io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      }, (res: MessagingNewConversation) => {
        expect(res.conversation.chatters.map(x => x.id).sort()).toEqual([userBasicPerms.user.id, userPerms.user.id].sort())
        expect(res.conversation.conversation.name).toEqual('test')
        io.disconnect()
        return done()
      })
    })
  })


  it('addUserReceiveMessage', (done) => {
    const io = getConnection(userPerms.apiToken)
    const io2 = getConnection(userBasicPerms.apiToken)
    io.on('connect', () => {
      // Start convo
      io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      }, (res: MessagingNewConversation) => {

        // user2 listen
        io.on(`message`, (message: MessagingMessage) => {
          expect(message.conversation).toBe(res.conversation.conversation.id)
          expect(message.message).toBe('Hello user1')
          expect(message.owner).toBe(userBasicPerms.user.id)

          io.disconnect()
          io2.disconnect()
          return done()
        })

        // User 2 listen
        io2.emit('listen', {
          conversationID: res.conversation.conversation.id,
          orgId: userBasicPerms.organisation.id
        }, (listenRes: MessagingConversationData) => {
          expect(listenRes.chatters.length).toBe(2)
          expect(listenRes.conversation.id).toBe(res.conversation.conversation.id)

          io2.emit('new-message', {
            conversationID: listenRes.conversation.id,
            message: 'Hello user1',
            orgId: userBasicPerms.organisation.id
          })
        })
      })
    })
  })

  it('badMessage', (done) => {
    const io = getConnection(userPerms.apiToken)
    const io2 = getConnection(userNotInConvo.apiToken)
    io.on('connect', () => {
      // Start convo
      io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      }, (res: MessagingNewConversation) => {

        io2.on('exception', (err) => {
          expect(err.error).toBe('You are not part of this conversation')
          io.disconnect()
          io2.disconnect()
          return done()
        })

        io2.emit('listen', {
          conversationID: res.conversation.conversation.id,
          orgId: userBasicPerms.organisation.id
        })
      })
    })
  })

  it('addUserReceiveMessageCountCheck', (done) => {
    const io = getConnection(userPerms.apiToken)
    const io2 = getConnection(userBasicPerms.apiToken)
    io.on('connect', () => {
      // Start convo
      io.emit(`start-conversation`, {
        name: 'test',
        chatters: [userBasicPerms.user.id],
        orgId: userBasicPerms.organisation.id
      }, (res: MessagingNewConversation) => {

        // User 2 listen
        io2.emit('listen', {
          conversationID: res.conversation.conversation.id,
          orgId: userBasicPerms.organisation.id
        }, async (listenRes: MessagingConversationData) => {
          expect(listenRes.chatters.length).toBe(2)
          expect(listenRes.conversation.id).toBe(res.conversation.conversation.id)

          // Add 50 messages
          for (let i = 0; i < 50; ++i) {
            io2.emit('new-message', {
              conversationID: listenRes.conversation.id,
              message: `test ${i}`,
              orgId: userBasicPerms.organisation.id
            })
            await sleep(10)
          }

          io2.emit('new-message', {
            conversationID: listenRes.conversation.id,
            message: `test 51`,
            orgId: userBasicPerms.organisation.id
          }, () => {
            io.emit('listen', {
              conversationID: res.conversation.conversation.id,
              orgId: userPerms.organisation.id
            }, (listenRes: MessagingConversationData) => {
              expect(listenRes.messages.length).toBe(30)
              expect(listenRes.messages[0].message).toBe('test 51')
              io.disconnect()
              io2.disconnect()
              return done()
            })
          })
        })
      })
    })
  })
});
