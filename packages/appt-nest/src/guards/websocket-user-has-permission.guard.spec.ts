import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Roleuser } from 'src/auto-resources/role-user/role-user.entity';
import { LocalsService } from 'src/services/locals/locals.service';
import { PermissionsService } from 'src/services/permissions/permissions.service';
import { Repository } from 'typeorm';
import { WSUserHasPermissionGuard } from './websocket-user-has-permission.guard';

describe('WSUserHasPermissionGuard', () => {
  let reflector: Reflector;
  let guard: WSUserHasPermissionGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
        PermissionsService,
        {
          provide: getRepositoryToken(Roleuser),
          useValue: createMock<Repository<Roleuser>>(),
        },
        LocalsService,
      ],
    }).compile();

    reflector = module.get<Reflector>(Reflector);

    guard = new WSUserHasPermissionGuard(
      reflector,
      module.get<PermissionsService>(PermissionsService),
    );

    module.useLogger(false);
  });

  it('hasPermissions', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1', 'p2', 'p3']);
    const mockContext = createMock<ExecutionContext>();
    const wshost = createMock<WsArgumentsHost>();
    wshost.getData.mockReturnValue({
      orgId: '123',
      siteId: '123',
      requestUserId: '123',
      permissions: ['p1', 'p3', 'p4', 'p2'],
    });
    mockContext.switchToWs.mockReturnValue(wshost);

    expect(await guard.canActivate(mockContext)).toEqual(true);
  });
  it('hasPermissionsFalse', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1', 'p2', 'p3']);
    const mockContext = createMock<ExecutionContext>();
    const wshost = createMock<WsArgumentsHost>();
    wshost.getData.mockReturnValue({
      orgId: '123',
      siteId: '123',
      requestUserId: '123',
      permissions: ['p3', 'p4', 'p2'],
    });
    mockContext.switchToWs.mockReturnValue(wshost);

    expect(await guard.canActivate(mockContext)).toEqual(false);
  });
});
