"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { offlineOrderMutations } from "../api/mutations"
import { offlineOrderKeys } from "../api/keys"
import type {
  ApproveOfflineOrderDeletionPayload,
  CreateOfflineOrderDeleteRequestPayload,
  SalesDashboardMenuItemsParams,
  SalesDashboardOrdersParams,
  SalesDashboardRecentTransactionsParams,
} from "../types"
import { offlineOrderQueries } from "../api/queries"

export function useSalesDashboardKitchens() {
  return useQuery(offlineOrderQueries.kitchens())
}

export function useSalesDashboardMenuItems(
  params: SalesDashboardMenuItemsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...offlineOrderQueries.menuItems(params),
    enabled: options?.enabled ?? params.kitchen_id > 0,
  })
}

export function useSalesDashboardOrders(
  params: SalesDashboardOrdersParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...offlineOrderQueries.orders(params),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardSavedOrdersQuery(
  params: SalesDashboardOrdersParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...offlineOrderQueries.savedOrders({ per_page: 50, ...params }),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardDeleteRequests(
  params: SalesDashboardOrdersParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...offlineOrderQueries.deleteRequests(params),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardStats(options?: { enabled?: boolean }) {
  return useQuery({
    ...offlineOrderQueries.stats(),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardTopStaff(options?: { enabled?: boolean }) {
  return useQuery({
    ...offlineOrderQueries.topStaff(),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardRecentActivity(options?: { enabled?: boolean }) {
  return useQuery({
    ...offlineOrderQueries.recentActivity(),
    enabled: options?.enabled ?? true,
  })
}

export function useSalesDashboardRecentTransactions(
  params: SalesDashboardRecentTransactionsParams = { limit: 10 },
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...offlineOrderQueries.recentTransactions(params),
    enabled: options?.enabled ?? true,
  })
}

export function useRequestOfflineOrderDeletion() {
  const queryClient = useQueryClient()

  return useMutation({
    ...offlineOrderMutations.requestDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineOrderKeys.all })
    },
  })
}

export function useApproveOfflineOrderDeletion() {
  const queryClient = useQueryClient()

  return useMutation({
    ...offlineOrderMutations.approveDeletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineOrderKeys.all })
    },
  })
}

export type RequestOfflineOrderDeletionInput = {
  orderId: string | number
  payload: CreateOfflineOrderDeleteRequestPayload
}

export type ApproveOfflineOrderDeletionInput = {
  orderId: string | number
  payload: ApproveOfflineOrderDeletionPayload
}
