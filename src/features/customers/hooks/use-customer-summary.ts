"use client"

import { useQuery } from "@tanstack/react-query"

import { customerQueries } from "../api/queries"

export function useCustomerOverview() {
  return useQuery(customerQueries.overview())
}

/** @deprecated Use useCustomerOverview */
export function useCustomerSummary() {
  return useCustomerOverview()
}
