import { OrderStatus } from "@/features/order/enums/order-status"
import type { ApiOrderRejectedBy, ApiOrderRejection } from "@/features/order/types"

export type OrderRejectionSource = {
  status?: string
  rejection_reason?: string | null
  rejected_at?: string | null
  rejected_by?: ApiOrderRejectedBy
  rejection?: ApiOrderRejection | null
}

export function getOrderRejection(
  order: OrderRejectionSource
): ApiOrderRejection | null {
  if (order.rejection?.reason?.trim()) {
    return order.rejection
  }

  const reason = order.rejection_reason?.trim()
  if (!reason) {
    return null
  }

  return {
    reason,
    rejected_at: order.rejected_at ?? "",
    rejected_by: order.rejected_by,
  }
}

export function canReviewOrder(order: OrderRejectionSource) {
  const status = order.status?.toLowerCase()

  if (status === OrderStatus.REJECTED || getOrderRejection(order)) {
    return false
  }

  return status === OrderStatus.PENDING
}

export function formatRejectedBy(value: ApiOrderRejectedBy | undefined) {
  if (!value) {
    return "—"
  }

  if (typeof value === "string") {
    return value.trim() || "—"
  }

  return value.name?.trim() || "—"
}
