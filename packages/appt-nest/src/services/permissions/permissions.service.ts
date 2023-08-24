import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Organisation } from 'src/auto-resources/organisation/organisation.entity';
import { User } from 'src/auto-resources/user/user.entity';
import { ApptBaseEntity } from 'src/base/appt-base-entity';
import { WebsocketDataBase } from 'src/messaging/dtos/websocket-base.dto';
import { Repository } from 'typeorm';
import { OrgPermissions } from '../../auto-resources/organisation/organisation.permissions';
import { Roleuser } from '../../auto-resources/role-user/role-user.entity';
import { SitePermissions } from '../../auto-resources/site/site.permissions';
import { UserPermissions } from '../../auto-resources/user/user.permissions';
import { LocalsService } from '../locals/locals.service';
import { PermissionSupplier } from './permission-supplier.interface';

export interface ownerPerms {
  otherOwner: boolean; // We can select/create with other owners in our own org and site
  otherSite: boolean; // God mode
  otherOrg: boolean; // We can select/create anything as long its within a site we are part of
  allOrg: boolean; // We can select/create anything as long as it belongs to an org we are part of
  allSite: boolean; // We can select/create everything as long as it belongs to a site we are part of
}

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  public permissions: string[] = [];

  constructor(
    @InjectRepository(Roleuser)
    private roleUserRepository: Repository<Roleuser>,
    private locals: LocalsService,
  ) {
    this.addPermssions(new UserPermissions());
    this.addPermssions(new OrgPermissions());
    this.addPermssions(new SitePermissions());
  }

  addPermssions(perms: PermissionSupplier) {
    this.permissions = this.permissions.concat(perms.getPermissions());
  }

  isDefined(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  getModel(req: Request) {
    const splits = req.url.split('/')[1];

    // Mainly for tests
    if (splits.includes('?')) {
      return splits.split('?')[0];
    }

    return splits;
  }

  async userCanAccess(req: Request, res: Response, baseData: ApptBaseEntity) {
    const user = this.locals.getUser(res);
    const organisation = this.locals.getOrganisation(res);
    const site = this.locals.getSite(res);
    const { otherOwner, otherOrg, otherSite, allSite, allOrg } =
      await this.getUserPerms(req, res);

    if (user.isdeveloper || user.isglobaladmin || otherSite) return true;

    // We are restricted by current user
    if (
      !otherOwner &&
      !otherOrg &&
      !otherSite &&
      !allOrg &&
      !allSite &&
      baseData.owner === user.id
    )
      return true;

    // We are restricted by current oug
    if (
      !otherOrg &&
      !otherSite &&
      !allSite &&
      baseData.organisation === organisation.id
    )
      return true;

    // We are restricted by site
    if (
      this.locals.getOrganisation(res).hassites &&
      !otherSite &&
      baseData.site === site.id
    )
      return true;

    return false;
  }

  async getUserPerms(req: Request, res: Response): Promise<ownerPerms> {
    const model = this.getModel(req);

    if (
      this.locals.getUser(res).isdeveloper ||
      this.locals.getUser(res).isglobaladmin
    ) {
      return {
        otherOwner: true,
        otherOrg: true,
        otherSite: true,
        allOrg: true,
        allSite: true,
      };
    }

    return {
      otherOwner: this.userHasPermissionUseLocals(res, [`${model}OtherOwner`]),
      otherOrg: this.userHasPermissionUseLocals(res, [`${model}OtherOrg`]),
      otherSite: this.userHasPermissionUseLocals(res, [`${model}OtherSite`]),
      allOrg: this.userHasPermissionUseLocals(res, [`${model}AllOrg`]),
      allSite: this.userHasPermissionUseLocals(res, [`${model}AllSite`]),
    };
  }

  async WSpermissionsGuard(reflector: Reflector, context: ExecutionContext) {
    const data = context.switchToWs().getData() as WebsocketDataBase;

    let ourPermissions = [];
    // Get the permissions
    const methodPerms = reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const classPerms = reflector.get<string[]>(
      'permissions',
      context.getClass(),
    );
    if (methodPerms) ourPermissions = ourPermissions.concat(methodPerms);
    if (classPerms) ourPermissions = ourPermissions.concat(classPerms);
    if (!ourPermissions.length) return true;

    if (!data.permissions) {
      this.logger.log(
        `Missing permissions in WSpermissionsGuard, has the WebSocketGuard been applied first ?`,
      );
      return false;
    }

    // Check we have the permissions
    for (const perm of ourPermissions) {
      if (!data.permissions.includes(perm.toLocaleLowerCase())) return false;
    }

    return true;
  }
  async permissionsGuard(
    reflector: Reflector,
    context: ExecutionContext,
    oneOrMore = false,
  ) {
    let ourPermissions = [];
    const res = context.switchToHttp().getResponse();

    // Method metadata
    const methodPerms = reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // Class Meta Data
    const classPerms = reflector.get<string[]>(
      'permissions',
      context.getClass(),
    );

    if (methodPerms) ourPermissions = ourPermissions.concat(methodPerms);
    if (classPerms) ourPermissions = ourPermissions.concat(classPerms);

    const user: User | undefined = this.locals.getUser(res);
    const org: Organisation | undefined = this.locals.getOrganisation(res);

    // Check we have all essential data
    if (!user || !ourPermissions?.length || !org) {
      this.logger.error({
        error: 'Missing middleware or missing permissions metadata',
        user: user,
        permissions: ourPermissions,
        organisation: org,
      });
      return false;
    }
    // They have all permissions
    else if (user.isglobaladmin || user.isdeveloper) {
      return true;
    }

    return this.userHasPermissionUseLocals(res, ourPermissions, oneOrMore);
  }

  getUserPermissions(res: Response) {
    return res.locals._userPermissions;
  }

  userHasPermissionUseLocals(
    res: Response,
    permissions: string[],
    oneOrMore = false,
  ): boolean {
    if (!this.getUserPermissions(res)) return false;

    if (oneOrMore) {
      for (const perm of permissions) {
        if (this.getUserPermissions(res).includes(perm.toLocaleLowerCase()))
          return true;
      }
    } else {
      for (const perm of permissions) {
        if (!this.getUserPermissions(res).includes(perm.toLocaleLowerCase()))
          return false;
      }
      return true;
    }
    return false;
  }

  async userHasPermission(
    userId: string,
    orgId: string,
    siteId: string,
    permissions: string[],
    oneOrMore = false,
  ): Promise<boolean> {
    // Get perms
    const roles = await this.roleUserRepository.find({
      owner: userId,
      organisation: orgId,
      ...(siteId && { site: siteId }),
    });

    // flatten the array
    // eslint-disable-next-line
    const perms = [].concat
      .apply(
        [],
        roles.map((x) => x.roleModel.permissions),
      )
      .map((x) => x.toLocaleLowerCase());

    // If empty they cant have any permissions
    if (!perms.length) return false;

    // Return true if we have one or more permissions
    if (oneOrMore) {
      for (const permission of permissions) {
        if (perms.includes(permission.toLocaleLowerCase())) return true;
      }
      return false;
    }

    // Else we need all of the permissions
    for (const permission of permissions) {
      if (!perms.includes(permission.toLocaleLowerCase())) return false;
    }
    return true;
  }
  currentUserHasPermission(res: Response, permission: string) {
    if (
      this.locals.getUser(res)?.isglobaladmin ||
      this.locals.getUser(res)?.isdeveloper
    )
      return true;
    return this.getUserPermissions(res).includes(
      permission.toLocaleLowerCase(),
    );
  }
  currentUserHasSomePermission(res: Response, perms: string[]) {
    return this.getUserPermissions(res).some((x) =>
      perms.includes(x.toLocaleLowerCase()),
    );
  }
}
