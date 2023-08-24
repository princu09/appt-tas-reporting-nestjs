import { PermissionSupplier } from '../../services/permissions/permission-supplier.interface';

export class SitePermissions implements PermissionSupplier {
  getPermissions(): string[] {
    return [
      'GetMySite',
      'GetAllSite',

      'DeleteMySite',
      'DeleteAllSite',

      'UpdateMySite',
      'UpdateAllSite',

      'CreateSite',

      `SiteGetMany`,
      `SiteGetOne`,
      `SiteCreateOne`,
      `SiteCreateMany`,
      `SiteUpdateOne`,
      `SiteReplaceOne`,
      `SiteDeleteOne`,
    ];
  }
}
