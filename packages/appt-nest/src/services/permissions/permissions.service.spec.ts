import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'test/helpers/mockType';
import { Repository } from 'typeorm';
import { Organisation } from '../../auto-resources/organisation/organisation.entity';
import { Roleuser } from '../../auto-resources/role-user/role-user.entity';
import { Site } from '../../auto-resources/site/site.entity';
import { User } from '../../auto-resources/user/user.entity';
import { LocalsService } from '../locals/locals.service';
import { PermissionSupplier } from './permission-supplier.interface';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let roleUserRepoMock: MockType<Repository<Roleuser>>;
  let user: User;
  let organisation: Organisation;
  let site: Site;

  class testPermissions implements PermissionSupplier {
    getPermissions() {
      return ['test1', 'test2', 'test3', 'test4', 'test6'];
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        LocalsService,
        {
          provide: getRepositoryToken(Roleuser),
          useValue: createMock<Repository<Roleuser>>(),
        },
      ],
    }).compile();

    module.useLogger(createMock<Logger>());
    roleUserRepoMock = module.get(getRepositoryToken(Roleuser));
    service = module.get<PermissionsService>(PermissionsService);
    service.addPermssions(new testPermissions());

    {
      // Initialise
      user = createMock<User>();
      user.id = '1';
      organisation = createMock<Organisation>();
      organisation.id = '1';
      site = createMock<Site>();
      site.id = '1';
      roleUserRepoMock.find.mockReturnValue([
        {
          roleModel: {
            permissions: ['test1', 'test4'],
          },
        },
        {
          roleModel: {
            permissions: ['test2', 'test6'],
          },
        },
      ]);
    }
  });

  it('isDefined-true', () => {
    expect(service.isDefined('test1')).toEqual(true);
  });
  it('isDefined-false', () => {
    expect(service.isDefined('test')).toEqual(false);
  });
  it('userHasPermissionOneOrMore-true', async () => {
    expect(
      await service.userHasPermission(
        user.id,
        organisation.id,
        site.id,
        ['test2', 'test6', 'zzz'],
        true,
      ),
    ).toEqual(true);
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'test6',
      ]),
    ).toEqual(true);
  });
  it('userHasPermissionOneOrMore-flase', async () => {
    expect(
      await service.userHasPermission(
        user.id,
        organisation.id,
        site.id,
        ['aaa', 'bbb', 'zzz'],
        true,
      ),
    ).toEqual(false);
    expect(
      await service.userHasPermission(
        user.id,
        organisation.id,
        site.id,
        ['ccc'],
        true,
      ),
    ).toEqual(false);
  });
  it('userHasPermission-true', async () => {
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'test2',
        'test6',
      ]),
    ).toEqual(true);
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'test6',
      ]),
    ).toEqual(true);
  });
  it('userHasPermission-false', async () => {
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'test3',
        'test6',
      ]),
    ).toEqual(false);
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'test3',
      ]),
    ).toEqual(false);
  });
  it('userHasPermission-badPermission', async () => {
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'weDontExist',
        'test3',
      ]),
    ).toEqual(false);
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'weDontExist',
      ]),
    ).toEqual(false);
  });
  it('userNoRoles', async () => {
    roleUserRepoMock.find.mockReturnValue([]);
    expect(
      await service.userHasPermission(user.id, organisation.id, site.id, [
        'weDontExist',
      ]),
    ).toEqual(false);
  });
});
