import { api } from "@/lib/api/client"
import type {
  ApiOfflineOrderResponse,
  ApiSalesDashboardSavedOrderMutationResponse,
  ApiSalesDashboardSavedOrderResponse,
} from "@/features/offline-order/types"

import type {
  ApiBulkOrderPreviewResponse,
  CreateBulkOrderPayload,
  SaveBulkOrderPayload,
} from "../types"
import { bulkOrderEndpoints } from "./endpoints"

export const bulkOrderMutations = {
  preview: {
    mutationFn: (payload: CreateBulkOrderPayload) =>
      api.post<ApiBulkOrderPreviewResponse>(
        bulkOrderEndpoints.preview,
        payload,
      ),
  },
  create: {
    mutationFn: (payload: CreateBulkOrderPayload) =>
      api.post<ApiOfflineOrderResponse>(bulkOrderEndpoints.orders, payload),
  },
  saveOrder: {
    mutationFn: (payload: SaveBulkOrderPayload) =>
      api.post<ApiSalesDashboardSavedOrderResponse>(
        bulkOrderEndpoints.savedOrders,
        payload,
      ),
  },
  updateSavedOrder: {
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string | number
      payload: SaveBulkOrderPayload
    }) =>
      api.put<ApiSalesDashboardSavedOrderResponse>(
        bulkOrderEndpoints.savedOrder(orderId),
        payload,
      ),
  },
  deleteSavedOrder: {
    mutationFn: (orderId: string | number) =>
      api.delete<ApiSalesDashboardSavedOrderMutationResponse>(
        bulkOrderEndpoints.savedOrder(orderId),
      ),
  },
  clearAllSavedOrders: {
    mutationFn: () =>
      api.delete<ApiSalesDashboardSavedOrderMutationResponse>(
        bulkOrderEndpoints.savedOrders,
      ),
  },
} as const
