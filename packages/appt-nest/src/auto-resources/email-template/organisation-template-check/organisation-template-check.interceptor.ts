import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalsService } from 'src/services/locals/locals.service';
import { OrganisationEmailTemplateService } from '../../organisation-email-template/organisation-email-template.service';
import { EmailTemplateDTO } from '../email-template.entity';

@Injectable()
export class OrganisationTemplateCheck implements NestInterceptor {
  constructor(
    public templateService: OrganisationEmailTemplateService,
    public locals: LocalsService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // Escape on these methods
    switch (req.method) {
      case 'DELETE':
      case 'GET':
        return next.handle();
    }

    // Check if the organisation email template belongs to our current organisation and site
    const checkBadOrganisationTemplate = async (id: string) => {
      if (!id) return;
      if (
        !(await this.templateService.findOne({
          id: id,
          organisation: this.locals.getOrganisation(res).id,
          ...(this.locals.getSite(res) && {
            site: this.locals.getSite(res).id,
          }),
        }))
      ) {
        throw new BadRequestException(
          `Invalid templateId ${id}. Template must belong to the same organisation and site you are currently using`,
        );
      }
    };

    // Handle bulk and non bulk data
    if (req.body.bulk) {
      for (const data of req.body.bulk) {
        await checkBadOrganisationTemplate(
          (data as EmailTemplateDTO)?.templateId,
        );
      }
    } else {
      await checkBadOrganisationTemplate(req.body?.templateId);
    }

    return next.handle();
  }
}
