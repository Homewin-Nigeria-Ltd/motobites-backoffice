"use client"

import { useQuery } from "@tanstack/react-query"

import { salesExecutiveQueries } from "../api/queries"
import type { SalesExecutiveListParams } from "../types"

export function useSalesExecutives(params: SalesExecutiveListParams) {
  return useQuery(salesExecutiveQueries.list(params))
}

export function useSalesExecutive(id: number | null) {
  return useQuery(salesExecutiveQueries.application(id ?? 0))
}
