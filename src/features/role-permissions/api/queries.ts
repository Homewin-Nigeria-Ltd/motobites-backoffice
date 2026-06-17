import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  PermissionCatalogApiResponse,
  RoleDetailApiResponse,
  RolesApiResponse,
} from "../types"
import { rolePermissionsEndpoints } from "./endpoints"
import { rolePermissionsKeys } from "./keys"

export const rolePermissionsQueries = {
  roles: () =>
    queryOptions({
      queryKey: rolePermissionsKeys.roles(),
      queryFn: async () => {
        const response = await api.get<RolesApiResponse>(
          rolePermissionsEndpoints.roles
        )
        return response.data
      },
      staleTime: 60_000,
    }),
  permissionCatalog: () =>
    queryOptions({
      queryKey: rolePermissionsKeys.permissionCatalog(),
      queryFn: async () => {
        const response = await api.get<PermissionCatalogApiResponse>(
          rolePermissionsEndpoints.permissionCatalog
        )
        return response.data
      },
      staleTime: 60_000,
    }),
  roleDetail: (slug: string) =>
    queryOptions({
      queryKey: rolePermissionsKeys.roleDetail(slug),
      queryFn: async () => {
        const response = await api.get<RoleDetailApiResponse>(
          rolePermissionsEndpoints.roleDetail(slug)
        )
        return response.data
      },
      enabled: Boolean(slug),
      staleTime: 60_000,
    }),
}
