import { PermissionSupplier } from '../../services/permissions/permission-supplier.interface';

export class UserPermissions implements PermissionSupplier {
  getPermissions(): string[] {
    return [
      'GetMyUser',
      'GetDirectAccessUsers',
      'GetOrgUsers',
      'GetSiteUsers',
      'GetAllUsers',

      'DeleteMyUser',
      'DeleteOrgUsers',
      'DeleteSiteUsers',
      'DeleteAllUsers',

      'UpdateMyUser',
      'UpdateDirectAccessUsers',
      'UpdateOrgUsers',
      'UpdateSiteUsers',
      'UpdateAllUsers',

      `CreateUser`,
      `CreateUserAny`,

      // Endpoint permissions
      `UserGetMany`,
      `UserGetOne`,
      `UserCreateOne`,
      `UserCreateMany`,
      `UserUpdateOne`,
      `UserReplaceOne`,
      `UserDeleteOne`,
    ];
  }
}
