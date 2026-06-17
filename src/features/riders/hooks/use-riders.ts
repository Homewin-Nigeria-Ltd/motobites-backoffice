"use client"

import { useQuery } from "@tanstack/react-query"

import { ridersQueries } from "../api/queries"
import type { RidersListParams } from "../types"

export function useRiders(params: RidersListParams) {
  return useQuery(ridersQueries.list(params))
}
