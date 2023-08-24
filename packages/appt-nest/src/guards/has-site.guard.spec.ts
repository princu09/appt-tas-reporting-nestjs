import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Organisation } from '../auto-resources/organisation/organisation.entity';
import { Site } from '../auto-resources/site/site.entity';
import { LocalsService } from '../services/locals/locals.service';
import { HasSiteGuard } from './has-site.guard';

describe('HasSiteGuard', () => {
  const locals = new LocalsService();
  const guard = new HasSiteGuard(locals);
  const organisation = new Organisation();
  const site = null;

  locals.getOrganisation = jest.fn().mockReturnValue(organisation);
  locals.getSite = jest.fn().mockReturnValue(site);
  it('false', () => {
    organisation.hassites = true;
    locals.getSite = jest.fn().mockReturnValue(null);
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(false);
  });
  it('good', () => {
    organisation.hassites = true;
    locals.getSite = jest.fn().mockReturnValue(new Site());
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
  it('good org has no site', () => {
    organisation.hassites = false;
    locals.getSite = jest.fn().mockReturnValue(new Site());
    expect(guard.canActivate(createMock<ExecutionContext>())).toEqual(true);
  });
});
