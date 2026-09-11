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
  tabCounts: (branchId?: number | null) =>
    queryOptions({
      queryKey: orderKeys.tabCounts(branchId),
      queryFn: () => {
        const query: Record<string, string | number> = {}
        if (branchId) {
          query.fulfillment_branch_id = branchId
          query.branch_id = branchId
        }
        return api
          .get<OrderTabCountsApiResponse>(orderEndpoints.tabCounts, query)
          .then((response) => response.data)
      },
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

        const branchId = params.fulfillment_branch_id ?? params.branch_id
        if (branchId) {
          query.fulfillment_branch_id = branchId
          query.branch_id = branchId
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

  assignees: (type: OrderAssigneeType, branchId?: number | null) =>
    queryOptions({
      queryKey: orderKeys.assignees(type, branchId),
      queryFn: () => {
        const query: Record<string, string | number> = { type }
        if (branchId) {
          query.fulfillment_branch_id = branchId
          query.branch_id = branchId
        }
        return api
          .get<OrderAssigneesApiResponse>(orderEndpoints.assignees, query)
          .then((response) => response.data)
      },
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
