import { PermissionSupplier } from '../../services/permissions/permission-supplier.interface';

export class OrgPermissions implements PermissionSupplier {
  getPermissions(): string[] {
    return [
      'GetMyOrg',
      'GetAllOrg',

      'DeleteMyOrg',
      'DeleteAllOrg',

      'UpdateMyOrg',
      'UpdateAllOrg',

      'CreateOrg',

      `OrganisationGetOne`,
      `OrganisationCreateOne`,
      `OrganisationCreateMany`,
      `OrganisationUpdateOne`,
      `OrganisationReplaceOne`,
      `OrganisationDeleteOne`,
    ];
  }
}
