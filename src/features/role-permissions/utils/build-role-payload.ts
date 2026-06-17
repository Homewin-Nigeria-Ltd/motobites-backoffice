import type { ApiPermissionCatalogItem, CreateRoleInput, RoleFormValues } from "../types"

export function buildDefaultPermissions(
  catalog: ApiPermissionCatalogItem[]
): Record<string, boolean> {
  return catalog.reduce<Record<string, boolean>>((accumulator, permission) => {
    accumulator[permission.key] = false
    return accumulator
  }, {})
}

export function buildCreateRoleInput(values: RoleFormValues): CreateRoleInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    is_favorited: false,
    permissions: Object.entries(values.permissions).map(([key, has_access]) => ({
      key,
      has_access,
    })),
  }
}
