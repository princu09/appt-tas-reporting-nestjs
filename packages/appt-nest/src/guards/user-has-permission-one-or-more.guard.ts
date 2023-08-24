import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../services/permissions/permissions.service';

@Injectable()
export class UserHasPermissionOneOrMoreGuard {
  constructor(
    public reflector: Reflector,
    public permissionService: PermissionsService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.permissionService.permissionsGuard(
      this.reflector,
      context,
      true,
    );
  }
}
