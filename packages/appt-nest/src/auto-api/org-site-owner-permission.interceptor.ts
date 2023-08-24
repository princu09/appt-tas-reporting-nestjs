import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/auto-resources/user/user.entity';
import { getConnection, getManager } from 'typeorm';
import { LocalsService } from '../services/locals/locals.service';
import {
  ownerPerms,
  PermissionsService,
} from '../services/permissions/permissions.service';

@Injectable()
export class OrgSiteOwnerPermissionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OrgSiteOwnerPermissionInterceptor.name);

  constructor(
    public permissionService: PermissionsService,
    public locals: LocalsService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const userPerms = await this.permissionService.getUserPerms(req, res);
    switch (req.method) {
      case 'DELETE':
        await this.enforceBadID(req, res, userPerms);
      case 'GET':
        this.checkForbiddenSearchParams(req, userPerms);
        this.enforceDefaultSearchParams(req, res, userPerms);
        break;
      case 'PATCH':
      case 'PUT':
        await this.enforceBadID(req, res, userPerms);
        this.checkForbiddenBodyElements(req, res, userPerms);
        this.enforceBodyElements(req, res, userPerms);
        break;
      case 'POST':
        this.checkForbiddenBodyElements(req, res, userPerms);
        this.enforceBodyElements(req, res, userPerms);
        break;
    }
    return next.handle();
  }

  getModel(req: Request) {
    const splits = req.url.split('/')[1];

    // Mainly for tests
    if (splits.includes('?')) {
      return splits.split('?')[0];
    }

    return splits;
  }

  async getUserPerms(req: Request, res: Response): Promise<ownerPerms> {
    // Let them do as they want
    if (
      (res.locals._user as User).isglobaladmin ||
      (res.locals._user as User).isdeveloper
    ) {
      return {
        otherOwner: true,
        otherOrg: true,
        otherSite: true,
        allOrg: true,
        allSite: true,
      };
    }

    const model = this.getModel(req);
    return {
      otherOwner: this.permissionService.userHasPermissionUseLocals(res, [
        `${model}OtherOwner`,
      ]),
      otherOrg: this.permissionService.userHasPermissionUseLocals(res, [
        `${model}OtherOrg`,
      ]),
      otherSite: this.permissionService.userHasPermissionUseLocals(res, [
        `${model}OtherSite`,
      ]),
      allOrg: this.permissionService.userHasPermissionUseLocals(res, [
        `${model}AllOrg`,
      ]),
      allSite: this.permissionService.userHasPermissionUseLocals(res, [
        `${model}AllSite`,
      ]),
    };
  }

  recursiveFind(object: Record<string, unknown>, key: string) {
    for (const objKey of Object.keys(object)) {
      if (objKey === key) {
        return true;
      } else if (typeof object[objKey] === 'object') {
        if (
          this.recursiveFind(object[objKey] as Record<string, unknown>, key)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async enforceBadID(req: Request, res: Response, ownerPerms: ownerPerms) {
    const { otherOwner, otherOrg, otherSite, allSite, allOrg } = ownerPerms;

    if (!req.params.id) {
      throw new BadRequestException(`Missing ID param`);
    }

    // Get the models db table name
    const model = this.permissionService.getModel(req);
    const data = getConnection().entityMetadatas.find(
      (x) =>
        x.name.toLocaleLowerCase() === model.toLocaleLowerCase() ||
        (x.givenTableName &&
          x.givenTableName.toLocaleLowerCase() === model.toLocaleLowerCase()),
    );
    if (!data) {
      this.logger.error(`Auto API::enforceBadID cannot findmodel (${model})`);
      throw new BadRequestException(`Cannot find model ${model}`);
    }

    // Work out how we need to restrict
    const params: any[] = [req.params.id];
    let query = `SELECT COUNT(*) as count FROM "${data.tableName}" WHERE id = $1 `;

    if (
      !otherOwner &&
      !otherOrg &&
      !allOrg &&
      !otherSite &&
      !allSite &&
      !allSite
    ) {
      query += ` AND owner = $${params.length + 1}`;
      params.push(this.locals.getUserId(res));
    }

    if (!otherOrg && !otherSite && !allSite) {
      query += ` AND organisation = $${params.length + 1} `;
      params.push(this.locals.getOrganisation(res).id);
    }

    if (this.locals.getOrganisation(res).hassites && !otherSite) {
      query += ` AND site = $${params.length + 1} `;
      params.push(this.locals.getSite(res)?.id);
    }

    // Run the query if '0' returned they dont have access to this by id
    if ((await getManager().query(query, params))[0].count == 0) {
      throw new ForbiddenException('You do not have access to this id');
    }
  }

  safeQuerySet(search: object, attribute: string, value: object) {
    if (search['$and']) {
      search['$and'][attribute] = value;
    }

    if (search['$or']) {
      search['$or'][attribute] = value;
    }

    search[attribute] = value;
    return search;
  }

  enforceDefaultSearchParams(
    req: Request,
    res: Response,
    ownerPerms: ownerPerms,
  ) {
    const { otherOwner, otherOrg, otherSite, allSite, allOrg } = ownerPerms;

    const enforceWherePermsFilters = {
      filter: [],
    };

    // Get search object
    const localSearch = {};
    let search = req?.query?.s ? JSON.parse(req.query.s as string) : {};

    // Is the initial search trying to search by org, owner or site ?
    const customeOrgSiteOwnerSearch =
      search['organisation'] || search['site'] || search['owner'];

    if (!otherOwner && !otherOrg && !otherSite && !allOrg && !allSite) {
      localSearch['owner'] = { $eq: this.locals.getUserId(res) };
      enforceWherePermsFilters.filter.push(
        `owner||eq||${this.locals.getUserId(res)}`,
      );
    }
    if ((!otherOrg && !otherSite && !allSite) || !customeOrgSiteOwnerSearch) {
      localSearch['organisation'] = {
        $eq: this.locals.getOrganisation(res).id,
      };
      enforceWherePermsFilters.filter.push(
        `organisation||eq||${this.locals.getOrganisation(res).id}`,
      );
    }
    if (
      // we dont have perm to select by site
      (!otherSite && !allSite && this.locals.getOrganisation(res).hassites) ||
      (!customeOrgSiteOwnerSearch && this.locals.getOrganisation(res).hassites)
    ) {
      localSearch['site'] = { $eq: this.locals.getSite(res).id };
      enforceWherePermsFilters.filter.push(
        `site||eq||${this.locals.getSite(res).id}`,
      );
    }

    // Always set the top level $and so the cannot be tricked
    search = { $and: [localSearch, search] };
    req.query.s = JSON.stringify(search);

    // Delete the old filters
    Object.keys(req.query).forEach(function (key) {
      if (key === 'filter') delete req.query[key];
    });

    // Add our new filters
    if (enforceWherePermsFilters.filter.length) {
      req.query = { ...req.query, ...enforceWherePermsFilters };
    }
  }

  checkForbiddenSearchParams(req: Request, ownerPerms: ownerPerms) {
    const { otherOwner, otherOrg, otherSite } = ownerPerms;

    if (Array.isArray(req.query.s))
      throw new BadRequestException('Cannot have multple s params');

    // Are we searching ?
    if (req.query.s) {
      let search = null;
      try {
        search = JSON.parse(req.query.s as string);
      } catch (err) {
        throw new BadRequestException('s query malformed json');
      }

      // Make sure we can't seach by fields we have no access to
      if (!otherOwner && this.recursiveFind(search, 'owner'))
        throw new ForbiddenException(
          'You do not have permission to select by owner',
        );
      if (!otherOrg && this.recursiveFind(search, 'organisation'))
        throw new ForbiddenException(
          'You do not have permission to select by organisation',
        );
      if (!otherSite && this.recursiveFind(search, 'site'))
        throw new ForbiddenException(
          'You do not have permission to select by site',
        );
    }
  }

  checkForbiddenBodyElements(
    req: Request,
    res: Response,
    ownerPerms: ownerPerms,
  ) {
    const { otherOwner, otherOrg, otherSite } = ownerPerms;

    const checkForbidden = (data: any) => {
      if (!otherOwner && data.owner && data.owner != this.locals.getUserId(res))
        throw new ForbiddenException(
          'You do not have permission to create with different owner',
        );
      if (
        !otherOrg &&
        data.organisation &&
        data.organisation != this.locals.getOrganisation(res).id
      )
        throw new ForbiddenException(
          'You do not have permission to create with different organisation',
        );
      if (!otherSite && this.locals.getOrganisation(res).hassites && data.site)
        throw new ForbiddenException(
          'You do not have permission to create with different site',
        );
      if (!this.locals.getOrganisation(res).hassites && data.site)
        throw new ForbiddenException('Organisation does not require a site');
    };

    if (req.body.bulk) {
      for (const data of req.body.bulk) {
        checkForbidden(data);
      }
    } else {
      checkForbidden(req.body);
    }
  }

  enforceBodyElements(req: Request, res: Response, ownerPerms: ownerPerms) {
    const { otherOwner, otherOrg, otherSite } = ownerPerms;

    const enforceSiteOrgOwner = (data: any) => {
      if (!otherOwner || !data.owner) data.owner = this.locals.getUserId(res);
      if (!otherOrg || !data.organisation)
        data.organisation = this.locals.getOrganisation(res).id;
      if (
        (!otherSite && this.locals.getOrganisation(res).hassites) ||
        (otherSite && this.locals.getOrganisation(res).hassites && !data.site)
      )
        data.site = this.locals.getSite(res).id;
    };

    if (req.body.bulk) {
      for (const data of req.body.bulk) {
        enforceSiteOrgOwner(data);
      }
    } else {
      enforceSiteOrgOwner(req.body);
    }
  }
}
