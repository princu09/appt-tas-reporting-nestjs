import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/services/permissions/permissions.service';
import { Repository } from 'typeorm';
import { LocalsService } from '../../services/locals/locals.service';
import { Siteuser } from '../site-user/site-user.entity';

@Injectable()
export class SiteAutoInterceptor implements NestInterceptor {
  constructor(
    public permissionService: PermissionsService,
    public locals: LocalsService,
    @InjectRepository(Siteuser)
    public siteUserRepo: Repository<Siteuser>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    switch (req.method) {
      case 'DELETE':
        await this.EnforceBadID(res, req.params.id, req.method);
        break;
      case 'GET':
        await this.EnforceBadID(res, req.params.id, req.method);
        await this.EnforceSearchParams(req, res);
        break;
      case 'PATCH':
        await this.EnforceBadID(res, req.params.id, 'update');
        break;
      case 'PUT':
        await this.EnforceBadID(res, req.params.id, 'replace');
        break;
      case 'POST':
        // Handled in the controller
        break;
    }
    return next.handle();
  }

  async EnforceBadID(res: Response, id: string, method: string) {
    if (!id) return;
    method = method.toLocaleLowerCase();

    if (
      this.permissionService.currentUserHasPermission(res, `${method}allsite`)
    )
      return;
    if (
      !this.permissionService.currentUserHasPermission(res, `${method}mysite`)
    ) {
      throw new ForbiddenException();
    }

    const count = await this.siteUserRepo.count({
      owner: this.locals.getUserId(res),
      site: id,
    });
    if (!count) throw new ForbiddenException();
  }

  async EnforceSearchParams(req: Request, res: Response) {
    if (this.permissionService.currentUserHasPermission(res, `getallsite`))
      return;
    if (!this.permissionService.currentUserHasPermission(res, `getmysite`))
      throw new ForbiddenException();

    const ret = await this.siteUserRepo.find({
      select: ['site'],
      where: {
        owner: this.locals.getUserId(res),
      },
    });

    const ids = ret.map((x) => x.site);
    Object.keys(req.query).forEach(function (key) {
      if (key === 'filter') delete req.query[key];
    });

    const enforceWherePermsFilters = {
      filter: [],
    };

    if (req?.query?.s && ids.length) {
      try {
        const search = JSON.parse(req.query.s as string);
        delete search['id'];
        search['id'] = { $in: ids };
        req.query.s = JSON.stringify(search);
      } catch (err) {
        delete req.query.s;
      }
    }

    if (!ids.length) {
      enforceWherePermsFilters.filter.push(`id||eq||0}`);
    } else if (ids.length === 1) {
      enforceWherePermsFilters.filter.push(`id||in||${ids.join(',')}`);
    }

    if (enforceWherePermsFilters.filter.length) {
      req.query = { ...req.query, ...enforceWherePermsFilters };
    }
  }
}
