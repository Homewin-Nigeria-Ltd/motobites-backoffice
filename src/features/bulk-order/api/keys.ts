import type { BulkOrderItemsParams, BulkOrderListParams } from "../types"

export const bulkOrderKeys = {
  all: ["bulk-order"] as const,
  items: (params: BulkOrderItemsParams = {}) =>
    [...bulkOrderKeys.all, "items", params] as const,
  orders: (params: BulkOrderListParams) =>
    [...bulkOrderKeys.all, "orders", params] as const,
  order: (orderId: string | number) =>
    [...bulkOrderKeys.all, "order", orderId] as const,
  savedOrders: (params: BulkOrderListParams) =>
    [...bulkOrderKeys.all, "saved-orders", params] as const,
  savedOrder: (orderId: string | number) =>
    [...bulkOrderKeys.all, "saved-order", orderId] as const,
}
