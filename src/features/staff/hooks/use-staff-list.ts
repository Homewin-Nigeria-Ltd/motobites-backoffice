"use client"

import { useQuery } from "@tanstack/react-query"

import { staffQueries } from "../api/queries"
import type { StaffListParams } from "../types"

export function useStaffList(params: StaffListParams) {
  return useQuery(staffQueries.list(params))
}
