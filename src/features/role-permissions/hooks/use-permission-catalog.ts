"use client"

import { useQuery } from "@tanstack/react-query"

import { rolePermissionsQueries } from "../api/queries"

export function usePermissionCatalog() {
  return useQuery(rolePermissionsQueries.permissionCatalog())
}
