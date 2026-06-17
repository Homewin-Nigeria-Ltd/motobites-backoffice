"use client"

import { useQuery } from "@tanstack/react-query"

import { rolePermissionsQueries } from "../api/queries"

export function useRoles() {
  return useQuery(rolePermissionsQueries.roles())
}
