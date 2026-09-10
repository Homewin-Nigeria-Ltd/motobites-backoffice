import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"

import type {
  ApiSalesTransactionListResponse,
  ApiSalesTransactionRecentListResponse,
  SalesTransactionListParams,
  SalesTransactionRecentParams,
} from "../types"
import { salesTransactionEndpoints } from "./endpoints"
import { salesTransactionKeys } from "./keys"

function buildTransactionsQuery(params: SalesTransactionListParams) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  }

  if (params.date_from) {
    query.date_from = params.date_from
  }

  if (params.date_to) {
    query.date_to = params.date_to
  }

  if (params.source) {
    query.source = params.source
  }

  if (params.payment_method) {
    query.payment_method = params.payment_method
  }

  if (params.status) {
    query.status = params.status
  }

  if (params.search) {
    query.search = params.search
  }

  return query
}

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
} as const
