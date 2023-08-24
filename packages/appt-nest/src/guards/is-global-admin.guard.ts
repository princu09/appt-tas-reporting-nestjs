import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class IsGlobalAdminGuard implements CanActivate {
  constructor(private readonly locals: LocalsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const res = context.switchToHttp().getResponse();
    if (
      this.locals.getUser(res)?.isglobaladmin ||
      this.locals.getUser(res)?.isdeveloper
    )
      return true;
    return false;
  }
}
