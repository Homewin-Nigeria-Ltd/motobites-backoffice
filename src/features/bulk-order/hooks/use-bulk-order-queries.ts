"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { bulkOrderKeys } from "../api/keys"
import { bulkOrderMutations } from "../api/mutations"
import { bulkOrderQueries } from "../api/queries"
import type { BulkOrderItemsParams, BulkOrderListParams } from "../types"

export function useBulkOrderItems(
  params: BulkOrderItemsParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...bulkOrderQueries.items(params),
    enabled: options?.enabled ?? true,
  })
}

export function useBulkOrders(
  params: BulkOrderListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...bulkOrderQueries.orders(params),
    enabled: options?.enabled ?? true,
  })
}

export function useBulkOrder(orderId: string | number | null) {
  return useQuery({
    ...bulkOrderQueries.order(orderId ?? ""),
    enabled: orderId != null && String(orderId).length > 0,
  })
}

export function useSavedBulkOrders(
  params: BulkOrderListParams = {},
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    ...bulkOrderQueries.savedOrders({ per_page: 50, ...params }),
    enabled: options?.enabled ?? true,
  })

  const savedOrders = query.data?.data ?? []

  return {
    ...query,
    savedOrders,
    savedOrderCount: query.data?.saved_orders_count ?? savedOrders.length,
  }
}

export function usePreviewBulkOrder() {
  return useMutation({
    ...bulkOrderMutations.preview,
  })
}

export function useDeleteSavedBulkOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    ...bulkOrderMutations.deleteSavedOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all })
    },
  })
}

export function useClearAllSavedBulkOrders() {
  const queryClient = useQueryClient()

  return useMutation({
    ...bulkOrderMutations.clearAllSavedOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkOrderKeys.all })
    },
  })
}
