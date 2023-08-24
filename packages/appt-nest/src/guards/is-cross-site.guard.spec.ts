import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { LocalsService } from '../services/locals/locals.service';
import { IsCrossSiteGuard } from './is-cross-site.guard';

describe('IsCrossSiteGuard', () => {
  it('test', () => {
    const locals = new LocalsService();
    locals.getInternal = jest.fn().mockReturnValue(true);
    const guard = new IsCrossSiteGuard(locals);
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
    locals.getInternal = jest.fn().mockReturnValue(false);
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(false);
  });
});
