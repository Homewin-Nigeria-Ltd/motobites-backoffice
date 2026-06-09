"use client"

import { useQuery } from "@tanstack/react-query"

import { staffQueries } from "../api/queries"

export function useStaffRoles() {
  return useQuery(staffQueries.roles())
}
