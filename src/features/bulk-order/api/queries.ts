import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiSalesDashboardOrder,
  ApiSalesDashboardOrderResponse,
  ApiSalesDashboardOrdersResponse,
  ApiSalesDashboardSavedOrderResponse,
} from "@/features/offline-order/types"

import type { BulkOrderItemsParams, BulkOrderListParams } from "../types"
import { extractCollection, extractMeta } from "../utils/unwrap"
import { mapBulkOrderMenuItems } from "../utils/map-items"
import { bulkOrderEndpoints } from "./endpoints"
import { bulkOrderKeys } from "./keys"

function buildItemsQuery(params: BulkOrderItemsParams = {}) {
  const query: Record<string, string | number> = {}

  if (params.search) {
    query.search = params.search
  }

  if (params.kitchen_id) {
    query.kitchen_id = params.kitchen_id
  }

  return Object.keys(query).length > 0 ? query : undefined
}

function buildListQuery(params: BulkOrderListParams) {
  const query: Record<string, string | number> = {
    per_page: params.per_page ?? 20,
    page: params.page ?? 1,
  }

  if (params.search) {
    query.search = params.search
  }

  if (
    params.fulfillment_branch_id !== undefined &&
    params.fulfillment_branch_id !== null
  ) {
    query.fulfillment_branch_id = params.fulfillment_branch_id
  }

  return query
}

export const bulkOrderQueries = {
  items: (params: BulkOrderItemsParams = {}) =>
    queryOptions({
      queryKey: bulkOrderKeys.items(params),
      queryFn: async () => {
        const response = await api.get<unknown>(
          bulkOrderEndpoints.items,
          buildItemsQuery(params),
        )

        return mapBulkOrderMenuItems(extractCollection(response))
      },
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  orders: (params: BulkOrderListParams) =>
    queryOptions({
      queryKey: bulkOrderKeys.orders(params),
      queryFn: async () => {
        const response = await api.get<ApiSalesDashboardOrdersResponse>(
          bulkOrderEndpoints.orders,
          buildListQuery(params),
        )
        const data = extractCollection(response) as ApiSalesDashboardOrder[]
        const meta = extractMeta(response)

        return {
          success: response.success,
          data,
          meta: {
            current_page: meta.current_page,
            last_page: meta.last_page,
            per_page: params.per_page ?? 20,
            total: response.meta?.total ?? data.length,
          },
          message: response.message,
        }
      },
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  order: (orderId: string | number) =>
    queryOptions({
      queryKey: bulkOrderKeys.order(orderId),
      queryFn: () =>
        api
          .get<ApiSalesDashboardOrderResponse>(
            bulkOrderEndpoints.order(orderId),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  savedOrders: (params: BulkOrderListParams) =>
    queryOptions({
      queryKey: bulkOrderKeys.savedOrders(params),
      queryFn: async () => {
        const response = await api.get<ApiSalesDashboardOrdersResponse>(
          bulkOrderEndpoints.savedOrders,
          buildListQuery(params),
        )
        const data = extractCollection(response) as ApiSalesDashboardOrder[]
        const meta = extractMeta(response)

        return {
          success: response.success,
          data,
          meta: {
            current_page: meta.current_page,
            last_page: meta.last_page,
            per_page: params.per_page ?? 50,
            total: response.meta?.total ?? data.length,
          },
          saved_orders_count: meta.saved_orders_count ?? data.length,
          message: response.message,
        }
      },
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  savedOrder: (orderId: string | number) =>
    queryOptions({
      queryKey: bulkOrderKeys.savedOrder(orderId),
      queryFn: () =>
        api
          .get<ApiSalesDashboardSavedOrderResponse>(
            bulkOrderEndpoints.savedOrder(orderId),
          )
          .then((response) => response.data),
      staleTime: 30_000,
    }),
} as const
