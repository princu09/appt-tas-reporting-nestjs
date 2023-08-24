import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class DefaultsInterceptor implements NestInterceptor {
  constructor(public locals: LocalsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    switch (req.method) {
      case 'POST':
      case 'PATCH':
      case 'PUT':
        if (req.body) {
          req.body.owner = this.locals.getUserId(res);
          req.body.organisation = this.locals.getOrganisation(res).id;
          if (this.locals.getOrganisation(res).hassites)
            req.body.site = this.locals.getSite(res).id;
        }
        break;
    }

    return next.handle();
  }
}
