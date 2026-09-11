import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"

import type {
  ApiSalesTransactionAnalyticsResponse,
  ApiSalesTransactionListResponse,
  ApiSalesTransactionManagementResponse,
  ApiSalesTransactionRecentListResponse,
  SalesTransactionAnalyticsParams,
  SalesTransactionListParams,
  SalesTransactionRecentParams,
} from "../types"
import { buildTransactionsQuery } from "../utils/build-transaction-query"
import { mapTransactionAnalyticsViewModel } from "../utils/map-transaction-analytics"
import { salesTransactionEndpoints } from "./endpoints"
import { salesTransactionKeys } from "./keys"

function buildRecentTransactionsQuery(params: SalesTransactionRecentParams) {
  const query: Record<string, string | number> = {
    limit: params.limit ?? 10,
  }

  if (params.payment_method) {
    query.payment_method = params.payment_method
  }

  if (params.date_from) {
    query.date_from = params.date_from
  }

  if (params.date_to) {
    query.date_to = params.date_to
  }

  return query
}

function buildTransactionAnalyticsQuery(
  params: SalesTransactionAnalyticsParams,
) {
  const query: Record<string, string> = {
    period: params.period ?? "year",
  }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  return query
}

export const salesTransactionQueries = {
  transactions: (params: SalesTransactionListParams = {}) =>
    queryOptions({
      queryKey: salesTransactionKeys.transactions(params),
      queryFn: () =>
        api
          .get<ApiSalesTransactionListResponse>(
            salesTransactionEndpoints.transactions,
            buildTransactionsQuery(params),
          )
          .then((response) => response),
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  recentTransactions: (params: SalesTransactionRecentParams = {}) =>
    queryOptions({
      queryKey: salesTransactionKeys.recentTransactions(params),
      queryFn: () =>
        api
          .get<ApiSalesTransactionRecentListResponse>(
            salesTransactionEndpoints.recentTransactions,
            buildRecentTransactionsQuery(params),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  transactionManagement: () =>
    queryOptions({
      queryKey: salesTransactionKeys.transactionManagement(),
      queryFn: () =>
        api
          .get<ApiSalesTransactionManagementResponse>(
            salesTransactionEndpoints.transactionManagement,
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  transactionAnalytics: (params: SalesTransactionAnalyticsParams = {}) =>
    queryOptions({
      queryKey: salesTransactionKeys.transactionAnalytics(params),
      queryFn: () =>
        api
          .get<ApiSalesTransactionAnalyticsResponse>(
            salesTransactionEndpoints.transactionAnalytics,
            buildTransactionAnalyticsQuery(params),
          )
          .then((response) =>
            mapTransactionAnalyticsViewModel(response.data),
          ),
      staleTime: 30_000,
    }),
} as const
