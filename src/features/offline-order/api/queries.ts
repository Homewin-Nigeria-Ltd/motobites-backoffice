import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"

import type {
  ApiSalesDashboardDeleteRequestsResponse,
  ApiSalesDashboardKitchensResponse,
  ApiSalesDashboardMenuItemsResponse,
  ApiSalesDashboardOrdersResponse,
  ApiSalesDashboardRecentActivityResponse,
  ApiSalesDashboardOperationalReportsResponse,
  ApiSalesDashboardRecentTransactionsResponse,
  ApiSalesDashboardSavedOrderResponse,
  ApiSalesDashboardStatsResponse,
  ApiSalesDashboardTopStaffResponse,
  SalesDashboardMenuItemsParams,
  SalesDashboardOperationalReportsParams,
  SalesDashboardOrdersParams,
  SalesDashboardRecentTransactionsParams,
} from "../types"
import { offlineOrderEndpoints } from "./endpoints"
import { offlineOrderKeys } from "./keys"

function buildMenuItemsQuery(params: SalesDashboardMenuItemsParams) {
  const query: Record<string, string | number> = {
    kitchen_id: params.kitchen_id,
    per_page: params.per_page ?? 20,
    page: params.page ?? 1,
  }

  if (params.search) {
    query.search = params.search
  }

  return query
}

function buildOrdersQuery(params: SalesDashboardOrdersParams) {
  const query: Record<string, string | number> = {
    per_page: params.per_page ?? 20,
    page: params.page ?? 1,
  }

  if (params.search) {
    query.search = params.search
  }

  return query
}

function buildRecentTransactionsQuery(
  params: SalesDashboardRecentTransactionsParams,
) {
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

function buildOperationalReportsQuery(
  params: SalesDashboardOperationalReportsParams,
) {
  return {
    period: params.period ?? "week",
  }
}

export const offlineOrderQueries = {
  kitchens: () =>
    queryOptions({
      queryKey: offlineOrderKeys.kitchens(),
      queryFn: () =>
        api
          .get<ApiSalesDashboardKitchensResponse>(offlineOrderEndpoints.kitchens)
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  menuItems: (params: SalesDashboardMenuItemsParams) =>
    queryOptions({
      queryKey: offlineOrderKeys.menuItems(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardMenuItemsResponse>(
            offlineOrderEndpoints.menuItems,
            buildMenuItemsQuery(params),
          )
          .then((response) => response),
      enabled: params.kitchen_id > 0,
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  orders: (params: SalesDashboardOrdersParams) =>
    queryOptions({
      queryKey: offlineOrderKeys.orders(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardOrdersResponse>(
            offlineOrderEndpoints.orders,
            buildOrdersQuery(params),
          )
          .then((response) => response),
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  savedOrders: (params: SalesDashboardOrdersParams) =>
    queryOptions({
      queryKey: offlineOrderKeys.savedOrders(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardOrdersResponse>(
            offlineOrderEndpoints.savedOrders,
            buildOrdersQuery(params),
          )
          .then((response) => response),
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  savedOrder: (orderId: string | number) =>
    queryOptions({
      queryKey: offlineOrderKeys.savedOrder(orderId),
      queryFn: () =>
        api
          .get<ApiSalesDashboardSavedOrderResponse>(
            offlineOrderEndpoints.savedOrder(orderId),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  deleteRequests: (params: SalesDashboardOrdersParams) =>
    queryOptions({
      queryKey: offlineOrderKeys.deleteRequests(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardDeleteRequestsResponse>(
            offlineOrderEndpoints.deleteRequests,
            buildOrdersQuery(params),
          )
          .then((response) => response),
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  stats: () =>
    queryOptions({
      queryKey: offlineOrderKeys.stats(),
      queryFn: () =>
        api
          .get<ApiSalesDashboardStatsResponse>(offlineOrderEndpoints.stats)
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  topStaff: () =>
    queryOptions({
      queryKey: offlineOrderKeys.topStaff(),
      queryFn: () =>
        api
          .get<ApiSalesDashboardTopStaffResponse>(offlineOrderEndpoints.topStaff)
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  recentActivity: () =>
    queryOptions({
      queryKey: offlineOrderKeys.recentActivity(),
      queryFn: () =>
        api
          .get<ApiSalesDashboardRecentActivityResponse>(
            offlineOrderEndpoints.recentActivity,
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  recentTransactions: (params: SalesDashboardRecentTransactionsParams = {}) =>
    queryOptions({
      queryKey: offlineOrderKeys.recentTransactions(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardRecentTransactionsResponse>(
            offlineOrderEndpoints.recentTransactions,
            buildRecentTransactionsQuery(params),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  operationalReports: (params: SalesDashboardOperationalReportsParams = {}) =>
    queryOptions({
      queryKey: offlineOrderKeys.operationalReports(params),
      queryFn: () =>
        api
          .get<ApiSalesDashboardOperationalReportsResponse>(
            offlineOrderEndpoints.operationalReports,
            buildOperationalReportsQuery(params),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),
} as const
