import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { Role } from '../auto-resources/role/role.entity';
import { Roleuser } from '../auto-resources/role-user/role-user.entity';
import { LocalsService } from '../services/locals/locals.service';
import { PermissionsMiddleware } from './permissions.middleware';
import { Response } from 'express';

describe('PermissionsMiddleware', () => {
  let repo: DeepMocked<Repository<Roleuser>>;
  let localService: LocalsService;
  let middleWare: PermissionsMiddleware;

  beforeEach(() => {
    repo = createMock<Repository<Roleuser>>();
    localService = new LocalsService();
    middleWare = new PermissionsMiddleware(repo, localService);
  });

  // non trusted perms
  it('Concat Perms', async () => {
    const u = new Roleuser();
    const u2 = new Roleuser();

    u.roleModel = new Role();
    u.roleModel.permissions = ['test1', 'test2'];

    u2.roleModel = new Role();
    u2.roleModel.permissions = ['test3', 'test4'];

    localService.getUserId = jest.fn().mockReturnValue('1');
    localService.getOrganisation = jest
      .fn()
      .mockReturnValue({ id: '1' } as Organisation);
    localService.setUserPermissions = jest.fn();

    repo.find.mockResolvedValue([u, u2]);
    // eslint-disable-next-line
    await middleWare.use(null, createMock<Response>(), () => {});
    expect(localService.setUserPermissions).toBeCalledWith(null, [
      'test1',
      'test2',
      'test3',
      'test4',
    ]);
  });

  it('NoUserOrId', async () => {
    const testFunc = jest.fn();
    await middleWare.use(null, createMock<Response>(), testFunc);
    expect(testFunc).toBeCalled();
  });
});
