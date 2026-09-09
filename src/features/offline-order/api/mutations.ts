import { api } from "@/lib/api/client"

import type {
  ApiOfflineOrderCancelResponse,
  ApiOfflineOrderDeleteRequestResponse,
  ApiOfflineOrderResponse,
  ApiSalesDashboardSavedOrderMutationResponse,
  ApiSalesDashboardSavedOrderResponse,
  CreateOfflineOrderDeleteRequestPayload,
  CreateOfflineOrderPayload,
  SaveOfflineOrderPayload,
} from "../types"
import { offlineOrderEndpoints } from "./endpoints"

export const offlineOrderMutations = {
  create: {
    mutationFn: (payload: CreateOfflineOrderPayload) =>
      api.post<ApiOfflineOrderResponse>(
        offlineOrderEndpoints.create,
        payload,
      ),
  },
  requestDeletion: {
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string | number
      payload: CreateOfflineOrderDeleteRequestPayload
    }) =>
      api.post<ApiOfflineOrderDeleteRequestResponse>(
        offlineOrderEndpoints.deleteRequest(orderId),
        payload,
      ),
  },
  approveDeletion: {
    mutationFn: (orderId: string | number) =>
      api.delete<ApiOfflineOrderCancelResponse>(
        offlineOrderEndpoints.order(orderId),
      ),
  },
  saveOrder: {
    mutationFn: (payload: SaveOfflineOrderPayload) =>
      api.post<ApiSalesDashboardSavedOrderResponse>(
        offlineOrderEndpoints.savedOrders,
        payload,
      ),
  },
  deleteSavedOrder: {
    mutationFn: (orderId: string | number) =>
      api.delete<ApiSalesDashboardSavedOrderMutationResponse>(
        offlineOrderEndpoints.savedOrder(orderId),
      ),
  },
  clearAllSavedOrders: {
    mutationFn: () =>
      api.delete<ApiSalesDashboardSavedOrderMutationResponse>(
        offlineOrderEndpoints.savedOrders,
      ),
  },
} as const
