"use client"

import { useQuery } from "@tanstack/react-query"

import { customerQueries } from "../api/queries"

export function useCustomerDetail(id: string, amount?: number) {
  return useQuery(customerQueries.detail(id, amount))
}
