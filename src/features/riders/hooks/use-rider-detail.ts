"use client"

import { useQuery } from "@tanstack/react-query"

import { ridersQueries } from "../api/queries"

export function useRiderDetail(
  riderId: string | number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...ridersQueries.detail(riderId),
    enabled: (options?.enabled ?? true) && Boolean(riderId),
  })
}
