"use client"

import { useQuery } from "@tanstack/react-query"

import { customerQueries } from "../api/queries"

export function useCustomerOverview(branchId?: number | null) {
  return useQuery(customerQueries.overview(branchId))
}

/** @deprecated Use useCustomerOverview */
export function useCustomerSummary(branchId?: number | null) {
  return useCustomerOverview(branchId)
}
