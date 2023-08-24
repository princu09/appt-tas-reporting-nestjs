import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class HasSiteGuard implements CanActivate {
  constructor(private readonly locals: LocalsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const res = context.switchToHttp().getResponse();
    if (!this.locals.getOrganisation(res)?.hassites) return true;
    return this.locals.getSite(res) ? true : false;
  }
}
