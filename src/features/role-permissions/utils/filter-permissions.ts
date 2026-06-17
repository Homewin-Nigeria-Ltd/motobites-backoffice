import type { PermissionCategory } from "../types"

export function filterPermissionCatalog(
  catalog: PermissionCategory[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return catalog
  }

  return catalog
    .map((category) => ({
      ...category,
      permissions: category.permissions.filter((permission) => {
        const haystack =
          `${permission.title} ${permission.description} ${category.label}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      }),
    }))
    .filter((category) => category.permissions.length > 0)
}
