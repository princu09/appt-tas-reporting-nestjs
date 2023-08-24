export interface PermissionSupplier {
  getPermissions(): string[];
}
