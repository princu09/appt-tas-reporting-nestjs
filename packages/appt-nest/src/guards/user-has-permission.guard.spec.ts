import { mockRepo } from '../../test/helpers/mockRepo';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserHasPermissionGuard } from './user-has-permission.guard';
import { Roleuser } from '../auto-resources/role-user/role-user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, Logger } from '@nestjs/common';
import { MockType } from '../../test/helpers/mockType';
import { PermissionsService } from '../services/permissions/permissions.service';
import { LocalsService } from '../services/locals/locals.service';
import { Site } from '../auto-resources/site/site.entity';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { User } from '../auto-resources/user/user.entity';

describe('UserHasPermissionGuard', () => {
  let roleUserRepoMock: MockType<Repository<Roleuser>>;
  let localsService: LocalsService;
  let reflector: Reflector;
  let guard: UserHasPermissionGuard;
  let mockQB: DeepMocked<SelectQueryBuilder<Roleuser>>;
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
          useFactory: () => {
            return mockRepo<Roleuser>();
          },
        },
        { provide: LocalsService, useValue: localsService },
        LocalsService,
      ],
    }).compile();

    module.useLogger(createMock<Logger>());
    permissionService = module.get(PermissionsService);
    localsService = module.get(LocalsService);
    roleUserRepoMock = module.get(getRepositoryToken(Roleuser));
    reflector = module.get<Reflector>(Reflector);

    guard = new UserHasPermissionGuard(
      reflector,
      module.get<PermissionsService>(PermissionsService),
    );

    mockQB = createMock<SelectQueryBuilder<Roleuser>>();
    mockQB.select.mockReturnThis();
    mockQB.where.mockReturnThis();
    mockQB.leftJoin.mockReturnThis();
    mockQB.andWhere.mockReturnThis();
    mockQB.execute.mockResolvedValue([]);
    roleUserRepoMock.createQueryBuilder = jest.fn().mockReturnValue(mockQB);
  });

  it('noUser', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1']);
    const mockContext = createMock<ExecutionContext>();
    const site = new Site();
    site.id = '1';
    const organisation = new Organisation();
    organisation.id = '1';

    localsService.getSite = jest.fn().mockReturnValue(site);
    localsService.getOrganisation = jest.fn().mockReturnValue(organisation);

    expect(await guard.canActivate(mockContext)).toEqual(false);
  });
  it('noOrg', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1']);
    const mockContext = createMock<ExecutionContext>();
    const site = new Site();
    site.id = '1';
    const user = new User();
    user.id = '1';
    localsService.getSite = jest.fn().mockReturnValue(site);
    localsService.getUser = jest.fn().mockReturnValue(user);
    localsService.getUserId = jest.fn().mockReturnValue('1');
    expect(await guard.canActivate(mockContext)).toEqual(false);
  });
  it('missingPermissions', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(null);
    const mockContext = createMock<ExecutionContext>();
    const organisation = new Organisation();
    organisation.id = '1';
    const user = new User();
    user.id = '1';

    localsService.getOrganisation = jest.fn().mockReturnValue(organisation);
    localsService.getUser = jest.fn().mockReturnValue(user);
    localsService.getUserId = jest.fn().mockReturnValue('1');
    expect(await guard.canActivate(mockContext)).toEqual(false);
  });
  it('hasPermissions', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['p1', 'p2', 'p3']);
    const mockContext = createMock<ExecutionContext>();
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
        permissions: `["p1","p3","p4"]`,
      },
    ]);
    permissionService.getUserPermissions = jest
      .fn()
      .mockReturnValue(['p1', 'p2', 'p3', 'p4']);
    const organisation = new Organisation();
    organisation.id = '1';
    const user = new User();
    user.id = '1';
    const site = new Site();
    site.id = '1';

    localsService.getSite = jest.fn().mockReturnValue(site);
    localsService.getOrganisation = jest.fn().mockReturnValue(organisation);
    localsService.getUser = jest.fn().mockReturnValue(user);
    localsService.getUserId = jest.fn().mockReturnValue('1');
    expect(await guard.canActivate(mockContext)).toEqual(true);
  });
});
