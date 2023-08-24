import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/services/permissions/permissions.service';

@Injectable()
export class WSUserHasPermissionGuard implements CanActivate {
  protected permissions: string[] = [];

  constructor(
    public reflector: Reflector,
    public permissionService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return await this.permissionService.WSpermissionsGuard(
      this.reflector,
      context,
    );
  }
}
