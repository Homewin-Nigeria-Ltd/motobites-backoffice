"use client"

import { useQuery } from "@tanstack/react-query"

import { customerQueries } from "../api/queries"
import type { CustomerListParams } from "../types"

export function useCustomerList(params: CustomerListParams) {
  return useQuery(customerQueries.list(params))
}
