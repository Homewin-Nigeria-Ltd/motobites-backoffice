"use client"

import { useQuery } from "@tanstack/react-query"

import { salesTransactionQueries } from "@/features/sales-transaction/api/queries"
import type {
  SalesTransactionAnalyticsParams,
  SalesTransactionListParams,
  SalesTransactionRecentParams,
} from "@/features/sales-transaction/types"

export function useSalesTransactions(
  params: SalesTransactionListParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...salesTransactionQueries.transactions(params),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesRecentTransactions(
  params: SalesTransactionRecentParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...salesTransactionQueries.recentTransactions(params),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesTransactionManagement(options?: {
  enabled?: boolean
}) {
  return useQuery({
    ...salesTransactionQueries.transactionManagement(),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesTransactionAnalytics(
  params: SalesTransactionAnalyticsParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...salesTransactionQueries.transactionAnalytics(params),
    enabled: options?.enabled ?? true,
  })
}
