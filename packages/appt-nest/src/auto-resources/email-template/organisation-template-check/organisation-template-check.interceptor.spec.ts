import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { OrganisationEmailTemplate } from 'src/auto-resources/organisation-email-template/organisation-email-template.entity';
import { OrganisationEmailTemplateService } from 'src/auto-resources/organisation-email-template/organisation-email-template.service';
import { LocalsService } from 'src/services/locals/locals.service';
import { OrganisationTemplateCheck } from './organisation-template-check.interceptor';

describe('OrganisationTemplateCheck', () => {
  let interceptor: OrganisationTemplateCheck = null;
  let organisationTemplateService: OrganisationEmailTemplateService = null;
  let localService: LocalsService = null;
  let context: DeepMocked<ExecutionContext> = null;
  let next: CallHandler = null;

  beforeEach(async () => {
    context = createMock<ExecutionContext>();
    next = createMock<CallHandler>();
    next.handle = jest.fn().mockReturnValue(1);
    organisationTemplateService =
      createMock<OrganisationEmailTemplateService>();
    localService = new LocalsService();
    localService.getOrganisation = jest.fn().mockReturnValue({ id: 'asdasd' });
    localService.getSite = jest.fn().mockReturnValue(false);
    interceptor = new OrganisationTemplateCheck(
      organisationTemplateService,
      localService,
    );
  });

  it('Get', () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'GET',
    });

    expect(interceptor.intercept(context, next)).resolves.toBe(1);
    expect(next.handle).toBeCalled();
  });
  it('Delete', () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'DELETE',
    });

    expect(interceptor.intercept(context, next)).resolves.toBe(1);
    expect(next.handle).toBeCalled();
  });

  it('PostBad', async () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'POST',
      body: { templateId: 1 },
    });
    jest.spyOn(organisationTemplateService, 'findOne').mockResolvedValue(null);
    await expect(interceptor.intercept(context, next)).rejects.toThrowError();
  });
  it('PostBulkBad', async () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'POST',
      body: { bulk: [{ templateId: 1 }] },
    });
    jest.spyOn(organisationTemplateService, 'findOne').mockResolvedValue(null);
    await expect(interceptor.intercept(context, next)).rejects.toThrowError();
  });
  it('PostGood', () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'POST',
      body: { templateId: 1 },
    });
    jest
      .spyOn(organisationTemplateService, 'findOne')
      .mockResolvedValue(new OrganisationEmailTemplate());
    return expect(interceptor.intercept(context, next)).resolves.toBe(1);
  });
  it('PostBulkGood', () => {
    const http = createMock<HttpArgumentsHost>();
    context.switchToHttp.mockReturnValue(http);
    http.getRequest.mockReturnValue({
      method: 'DELETE',
    });
    next.handle = jest.fn().mockReturnValue(1);

    expect(interceptor.intercept(context, next)).resolves.toBe(1);
    expect(next.handle).toBeCalled();
  });
});
