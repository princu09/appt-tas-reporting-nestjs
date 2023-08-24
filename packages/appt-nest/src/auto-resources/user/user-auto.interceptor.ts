import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { getConnection, Repository } from 'typeorm';
import { LocalsService } from '../../services/locals/locals.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { Organisation } from '../organisation/organisation.entity';
import { Siteuser } from '../site-user/site-user.entity';
import { Userdirectaccess } from '../user-direct-access/user-direct-access.entity';
import { User } from './user.entity';

@Injectable()
export class UserAutoInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserAutoInterceptor.name);

  constructor(
    public permissionService: PermissionsService,
    public locals: LocalsService,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(Siteuser)
    public siteUserRepo: Repository<Siteuser>,
    @InjectRepository(Userdirectaccess)
    public userDirectAccessRepo: Repository<Userdirectaccess>,
    @InjectRepository(Organisation)
    public orgRepo: Repository<Organisation>,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    if (!this.locals.getUser(res).isglobaladmin) {
      switch (req.method) {
        case 'DELETE':
          await this.EnforceBadID(res, req.params.id, req.method);
        case 'GET':
          await this.EnforceBadID(res, req.params.id, req.method);
          await this.EnforceSearchParams(req, res);
          break;
        case 'PATCH':
        case 'PUT':
          await this.EnforceBadID(res, req.params.id, 'update');
          break;
        case 'POST':
          this.PostRequest(res);
          break;
      }
    }
    return next.handle();
  }

  PostRequest(res: Response) {
    // Can do what they want
    if (this.permissionService.currentUserHasPermission(res, 'createuserany'))
      return;
    if (!this.permissionService.currentUserHasPermission(res, 'createuser')) {
      throw new ForbiddenException(`You do not have access to create a user`);
    }
  }

  async EnforceSearchParams(req: Request, res: Response) {
    const perms = [
      `getmyuser`,
      `getdirectaccessusers`,
      `getorgusers`,
      `getsiteusers`,
      `getallusers`,
    ];

    const enforceWherePermsFilters = {
      filter: [],
    };

    let allowedIDArray = [];

    // Do we have any perms
    if (!this.permissionService.currentUserHasSomePermission(res, perms)) {
      throw new ForbiddenException(
        `You have no get user permissions we are looking for.`,
      );
    }

    // Can get what they want
    if (this.permissionService.currentUserHasPermission(res, 'getallusers'))
      return;

    // add all site users if we have perm
    if (
      this.locals.getOrganisation(res).hassites &&
      this.permissionService.currentUserHasPermission(res, 'getsiteusers')
    ) {
      const siteUsers = await this.siteUserRepo.find({
        select: ['owner'],
        where: {
          site: this.locals.getSite(res).id,
        },
      });

      // Need to enforce site always if they cant view all
      allowedIDArray = siteUsers.map((x) => x.owner);
    }
    // If they dont have access to all org users then we need to enforce user level permissions
    else if (
      this.permissionService.currentUserHasPermission(res, 'getorgusers')
    ) {
      const ret = await this.orgRepo
        .createQueryBuilder('org')
        .where({ id: this.locals.getOrganisation(res).id })
        .leftJoin('org.users', 'user')
        .select(['user.id'])
        .execute();
      allowedIDArray = ret.map((x) => x.user_id);
    } else {
      if (
        !this.permissionService.currentUserHasPermission(
          res,
          'getdirectaccessusers',
        )
      ) {
        allowedIDArray.push(this.locals.getUserId(res));
      }
      // Else only allow users they have direct access to
      else {
        const ret = await this.userDirectAccessRepo.find({
          select: ['targetuser'],
          where: {
            usergrantedaccess: this.locals.getUserId(res),
          },
        });
        allowedIDArray = ret.map((x) => x.targetuser);
      }
    }

    // Delete the old filters
    Object.keys(req.query).forEach(function (key) {
      if (key === 'filter') delete req.query[key];
    });

    if (allowedIDArray.length) {
      // Add allowed ids
      enforceWherePermsFilters.filter.push(
        `id||in||${allowedIDArray.join(',')}`,
      );
    }
    // No ids so set something that will return nothing
    else {
      enforceWherePermsFilters.filter.push(`id||eq||0`);
    }

    // Update the search criteria too
    if (req?.query?.s && allowedIDArray.length) {
      try {
        const search = JSON.parse(req.query.s as string);
        delete search['id'];
        search['id'] = { $in: allowedIDArray };
        req.query.s = JSON.stringify(search);
      } catch (err) {
        this.logger.error(`something went wrong restricting the query`, err);
        delete req.query.s;
      }
    }

    // Add our new filters
    if (enforceWherePermsFilters.filter.length) {
      req.query = { ...req.query, ...enforceWherePermsFilters };
    }
  }

  async EnforceBadID(res: Response, id: string, method: string) {
    method = method.toLocaleLowerCase();
    const perms =
      method === 'delete'
        ? [
            `${method}myuser`,
            `${method}orgusers`,
            `${method}siteusers`,
            `${method}allusers`,
          ]
        : [
            `${method}myuser`,
            `${method}directaccessusers`,
            `${method}orgusers`,
            `${method}siteusers`,
            `${method}allusers`,
          ];

    if (!id) return; // No bad id to enforce

    if (!this.permissionService.currentUserHasSomePermission(res, perms)) {
      throw new ForbiddenException(
        `You have no ${method} user permissions we are looking for.`,
      );
    }

    // If they have the all user perm they can do what they want
    if (
      !this.permissionService.currentUserHasPermission(res, `${method}allusers`)
    ) {
      // Make sure if the current organisation has sites that this user belongs to that site
      if (this.locals.getOrganisation(res).hassites) {
        if (
          !(await this.siteUserRepo.count({
            site: this.locals.getSite(res).id,
            owner: id,
          }))
        ) {
          throw new ForbiddenException(
            `You do not have access to ${method} other users from other sites`,
          );
        }

        if (
          this.permissionService.currentUserHasPermission(
            res,
            `${method}siteusers`,
          )
        )
          return;
      }

      // Do they have to be in this org ?
      if (
        !this.permissionService.currentUserHasPermission(
          res,
          `${method}orgusers`,
        )
      ) {
        const ret = await getConnection().query(
          `SELECT COUNT(*) FROM organisation_users_user where "userId" = $1 AND "organisationId" = $2`,
          [id, this.locals.getOrganisation(res).id],
        );
        if (!+ret[0].count)
          new ForbiddenException(
            `You do not have access to ${method} other users from other organisations`,
          );
      } else {
        return;
      }

      // do we have direct acess
      if (
        method !== 'delete' &&
        this.permissionService.currentUserHasPermission(
          res,
          `${method}directaccessusers`,
        ) &&
        id != this.locals.getUserId(res)
      ) {
        if (
          !(await this.userDirectAccessRepo.count({
            targetuser: id,
            usergrantedaccess: this.locals.getUserId(res),
          }))
        ) {
          throw new ForbiddenException(
            `You do not have access to ${method} other users`,
          );
        }
        return;
      }
      // Last perm is access to us which they must have
      else if (id != this.locals.getUserId(res)) {
        throw new ForbiddenException(
          `You do not have access to ${method} other users`,
        );
      }
    }
  }
}
