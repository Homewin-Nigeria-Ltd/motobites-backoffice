import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  OrderAssigneeType,
  OrderAssigneesApiResponse,
  OrderDetailApiResponse,
  OrderReceiptApiResponse,
  OrderTabCountsApiResponse,
  OrdersGroupedApiResponse,
  OrdersGroupedParams,
} from "../types"
import { orderEndpoints } from "./endpoints"
import { orderKeys } from "./keys"

export const orderQueries = {
  tabCounts: () =>
    queryOptions({
      queryKey: orderKeys.tabCounts(),
      queryFn: () =>
        api
          .get<OrderTabCountsApiResponse>(orderEndpoints.tabCounts)
          .then((response) => response.data),
      staleTime: 30_000,
    }),

  grouped: (params: OrdersGroupedParams) =>
    queryOptions({
      queryKey: orderKeys.grouped(params),
      queryFn: () => {
        const query: Record<string, string | number> = {
          tab: params.tab,
          per_page: params.per_page ?? 20,
          page: params.page ?? 1,
        }

        if (params.search) {
          query.search = params.search
        }

        return api
          .get<OrdersGroupedApiResponse>(orderEndpoints.grouped, query)
          .then((response) => response.data)
      },
      placeholderData: (previous) => previous,
    }),

  detail: (orderId: string) =>
    queryOptions({
      queryKey: orderKeys.detail(orderId),
      queryFn: () =>
        api
          .get<OrderDetailApiResponse>(orderEndpoints.detail(orderId))
          .then((response) => response.data),
    }),

  assignees: (type: OrderAssigneeType) =>
    queryOptions({
      queryKey: orderKeys.assignees(type),
      queryFn: () =>
        api
          .get<OrderAssigneesApiResponse>(orderEndpoints.assignees, { type })
          .then((response) => response.data),
      staleTime: 60_000,
    }),

  receipt: (orderId: string) =>
    queryOptions({
      queryKey: orderKeys.receipt(orderId),
      queryFn: () =>
        api
          .get<OrderReceiptApiResponse>(orderEndpoints.receipt(orderId))
          .then((response) => response.data),
    }),
}
