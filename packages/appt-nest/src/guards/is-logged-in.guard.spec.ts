import { IsLoggedInGuard } from './is-logged-in.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { LocalsService } from '../services/locals/locals.service';

describe('IsLoggedInGuard', () => {
  let apiToken: IsLoggedInGuard;
  let localsService: LocalsService;

  beforeEach(() => {
    localsService = new LocalsService();
    apiToken = new IsLoggedInGuard(localsService);
  });

  it('goodApiToken', () => {
    const mockContext = createMock<ExecutionContext>();
    localsService.getUserId = jest.fn().mockReturnValue('1');
    const canActivate = apiToken.canActivate(mockContext);
    expect(canActivate).toBe(true);
  });

  it('badApiToken', () => {
    const mockContext = createMock<ExecutionContext>();
    mockContext.getArgByIndex.mockReturnValue({
      locals: {},
    });
    localsService.getUserId = jest.fn().mockReturnValue(null);
    const canActivate = apiToken.canActivate(mockContext);
    expect(canActivate).toBe(false);
  });
});
