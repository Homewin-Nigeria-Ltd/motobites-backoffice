export const rolePermissionsEndpoints = {
  roles: "/api/proxy/admin/settings/roles",
  permissionCatalog: "/api/proxy/admin/settings/roles/permission-catalog",
  roleDetail: (slug: string) =>
    `/api/proxy/admin/settings/roles/${encodeURIComponent(slug)}`,
} as const
