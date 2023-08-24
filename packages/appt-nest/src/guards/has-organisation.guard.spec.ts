import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { LocalsService } from '../services/locals/locals.service';
import { HasOrganisationGuard } from './has-organisation.guard';

describe('HasOrganisationGuard', () => {
  const locals = new LocalsService();
  const guard = new HasOrganisationGuard(locals);
  it('false', () => {
    locals.getOrganisation = jest.fn().mockReturnValue(null);
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(false);
  });
  it('good', () => {
    locals.getOrganisation = jest.fn().mockReturnValue(new Organisation());
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
});
