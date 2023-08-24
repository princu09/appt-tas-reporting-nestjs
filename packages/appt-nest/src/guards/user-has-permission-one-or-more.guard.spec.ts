import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { Roleuser } from '../auto-resources/role-user/role-user.entity';
import { Site } from '../auto-resources/site/site.entity';
import { User } from '../auto-resources/user/user.entity';
import { LocalsService } from '../services/locals/locals.service';
import { PermissionsService } from '../services/permissions/permissions.service';
import { UserHasPermissionOneOrMoreGuard } from './user-has-permission-one-or-more.guard';

describe('UserHasPermissionGuard', () => {
  let localsService: LocalsService;
  let reflector: Reflector;
  let guard: UserHasPermissionOneOrMoreGuard;
  let permissionService: PermissionsService;

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
          useValue: createMock<Roleuser>(),
        },
        LocalsService,
      ],
    }).compile();

    module.useLogger(createMock<Logger>());
    permissionService = module.get(PermissionsService);
    localsService = module.get(LocalsService);
    reflector = module.get<Reflector>(Reflector);

    guard = new UserHasPermissionOneOrMoreGuard(
      reflector,
      module.get<PermissionsService>(PermissionsService),
    );
  });
  it('hasPermissions', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1', 'p2', 'p3']);
    const mockContext = createMock<ExecutionContext>();
    const mockQB = createMock<SelectQueryBuilder<Roleuser>>();
    mockQB.select.mockReturnThis();
    mockQB.where.mockReturnThis();
    mockQB.leftJoin.mockReturnThis();
    mockQB.andWhere.mockReturnThis();
    mockQB.execute.mockResolvedValue([
      {
        permissions: ``,
      },
      {
        permissions: `[]`,
      },
      {
        permissions: `["p2"]`,
      },
      {
        permissions: `[]`,
      },
    ]);
    const organisation = new Organisation();
    organisation.id = '1';
    const user = new User();
    user.id = '1';
    const site = new Site();
    site.id = '1';

    permissionService.getUserPermissions = jest
      .fn()
      .mockReturnValue(['p2', 'p1', 'p3']);
    localsService.getOrganisation = jest.fn().mockReturnValue(organisation);
    localsService.getUser = jest.fn().mockReturnValue(user);
    localsService.getSite = jest.fn().mockReturnValue(site);
    expect(await guard.canActivate(mockContext)).toEqual(true);
  });
});
