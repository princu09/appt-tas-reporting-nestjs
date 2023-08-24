import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { OrganisationService } from 'src/auto-resources/organisation/organisation.service';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { SiteService } from 'src/auto-resources/site/site.service';
import { Repository } from 'typeorm';
import { WebSocketGuard } from './websocket.guard';

describe('websocketGuard', () => {
  let authService: DeepMocked<AuthenticationService> = null;
  let orgService: DeepMocked<OrganisationService> = null;
  let siteService: DeepMocked<SiteService> = null;
  let roleUserRepo: DeepMocked<Repository<Roleuser>> = null;
  let guard: WebSocketGuard = null;

  beforeEach(() => {
    authService = createMock<AuthenticationService>();
    orgService = createMock<OrganisationService>();
    siteService = createMock<SiteService>();
    roleUserRepo = createMock<Repository<Roleuser>>();

    guard = new WebSocketGuard(
      authService,
      orgService,
      siteService,
      roleUserRepo,
    );
  });

  it('missing data', async () => {
    const socket = {
      handshake: {
        headers: {
          authorization: '123',
        },
      },
    };
    const data = {};

    const context = createMock<ExecutionContext>();

    context.switchToWs.mockReturnValue({
      getClient: jest.fn().mockReturnValue(socket),
      getData: jest.fn().mockReturnValue(data),
    });

    expect.assertions(2);
    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e.error).toEqual(`Missing orgId query parameter`);
    }

    delete socket.handshake.headers.authorization;
    try {
      expect(await guard.canActivate(context)).toThrow('hello');
    } catch (e) {
      expect(e.error).toEqual(`Missing authorization header`);
    }
  });
  it('badJWT', async () => {
    const socket = {
      handshake: {
        headers: {
          authorization: '123',
        },
      },
    };
    const data = {
      orgId: 1,
    };

    const context = createMock<ExecutionContext>();

    authService.validateToken.mockReturnValue(null);

    context.switchToWs.mockReturnValue({
      getClient: jest.fn().mockReturnValue(socket),
      getData: jest.fn().mockReturnValue(data),
    });

    expect.assertions(1);
    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e.error).toEqual(`Invalid authorization token`);
    }
  });
  it('badOrg', async () => {
    const socket = {
      handshake: {
        headers: {
          authorization: '123',
        },
      },
    };
    const data = {
      orgId: 1,
    };

    const context = createMock<ExecutionContext>();

    authService.validateToken.mockReturnValue({ userId: '1' });
    orgService.userInOrganisation.mockResolvedValue(false);

    context.switchToWs.mockReturnValue({
      getClient: jest.fn().mockReturnValue(socket),
      getData: jest.fn().mockReturnValue(data),
    });

    expect.assertions(1);
    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e.error).toEqual(`Invalid orgId parameter`);
    }
  });
  it('badSite', async () => {
    const socket = {
      handshake: {
        headers: {
          authorization: '123',
        },
      },
    };
    const data = {
      orgId: 1,
    };

    const context = createMock<ExecutionContext>();

    authService.validateToken.mockReturnValue({ userId: '1' });
    orgService.userInOrganisation.mockResolvedValue(true);
    siteService.validSite.mockResolvedValue(false);

    context.switchToWs.mockReturnValue({
      getClient: jest.fn().mockReturnValue(socket),
      getData: jest.fn().mockReturnValue(data),
    });

    expect.assertions(1);
    try {
      await guard.canActivate(context);
    } catch (e) {
      expect(e.error).toEqual(`Invalid siteId parameter`);
    }
  });
  it('good', async () => {
    const socket = {
      handshake: {
        headers: {
          authorization: '123',
        },
      },
    };
    const data = {
      orgId: 1,
      siteId: 1,
    };

    roleUserRepo.find.mockResolvedValue([
      {
        roleModel: {
          permissions: [`permission1`, `Permission2`],
        },
      },
      {
        roleModel: {
          permissions: [`PERMISSION3`, `PERMISSION4`],
        },
      },
    ] as Roleuser[]);

    const context = createMock<ExecutionContext>();

    authService.validateToken.mockReturnValue({ userId: '1' });
    orgService.userInOrganisation.mockResolvedValue(true);
    siteService.validSite.mockResolvedValue(true);

    context.switchToWs.mockReturnValue({
      getClient: jest.fn().mockReturnValue(socket),
      getData: jest.fn().mockReturnValue(data),
    });

    expect(await guard.canActivate(context)).toBe(true);

    expect(data['requestUserId']).toEqual('1');
    expect(data['permissions']).toEqual([
      'permission1',
      'permission2',
      'permission3',
      'permission4',
    ]);
  });
});
