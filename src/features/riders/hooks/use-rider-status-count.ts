"use client"

import { useQuery } from "@tanstack/react-query"

import { ridersQueries } from "../api/queries"
import type { RiderOverviewStatus } from "../types"

export function useRiderStatusCount(
  status: RiderOverviewStatus,
  search?: string
) {
  return useQuery(
    ridersQueries.list({ page: 1, per_page: 1, search, status })
  )
}
