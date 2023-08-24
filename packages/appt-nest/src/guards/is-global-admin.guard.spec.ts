import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { User } from 'src/auto-resources/user/user.entity';
import { Site } from '../auto-resources/site/site.entity';
import { LocalsService } from '../services/locals/locals.service';
import { IsGlobalAdminGuard } from './is-global-admin.guard';

describe('IsGlobalAdmin', () => {
  const locals = new LocalsService();
  const guard = new IsGlobalAdminGuard(locals);
  const user = new User();

  locals.getUser = jest.fn().mockReturnValue(user);
  it('false', () => {
    locals.getSite = jest.fn().mockReturnValue(null);
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(false);
  });
  it('good', () => {
    user.isdeveloper = true;
    locals.getSite = jest.fn().mockReturnValue(new Site());
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
  it('good', () => {
    user.isdeveloper = false;
    user.isglobaladmin = true;
    locals.getSite = jest.fn().mockReturnValue(new Site());
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
});
