"use client"

import { useQuery } from "@tanstack/react-query"

import { rolePermissionsQueries } from "../api/queries"

export function useRoleDetail(slug: string) {
  return useQuery(rolePermissionsQueries.roleDetail(slug))
}
