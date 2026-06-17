export const rolePermissionsKeys = {
  all: ["role-permissions"] as const,
  roles: () => [...rolePermissionsKeys.all, "roles"] as const,
  permissionCatalog: () =>
    [...rolePermissionsKeys.all, "permission-catalog"] as const,
  roleDetail: (slug: string) =>
    [...rolePermissionsKeys.all, "role-detail", slug] as const,
}
