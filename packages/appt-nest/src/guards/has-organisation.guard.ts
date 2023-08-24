import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocalsService } from '../services/locals/locals.service';

@Injectable()
export class HasOrganisationGuard implements CanActivate {
  constructor(private readonly locals: LocalsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.locals.getOrganisation(context.switchToHttp().getResponse())
      ? true
      : false;
  }
}
