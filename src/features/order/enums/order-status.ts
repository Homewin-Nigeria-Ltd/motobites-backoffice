export enum OrderStatus {
  AWAITING_PAYMENT = "awaiting_payment",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  PICKED_UP = "picked_up",
  DELIVERED = "delivered",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.AWAITING_PAYMENT]: "Awaiting Payment",
  [OrderStatus.PENDING]: "yet to be prepared",
  [OrderStatus.CONFIRMED]: "yet to be prepared",
  [OrderStatus.PREPARING]: "Preparing",
  [OrderStatus.READY]: "Preparing",
  [OrderStatus.PICKED_UP]: "In Transit",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.FAILED]: "Failed",
  [OrderStatus.CANCELLED]: "Cancelled",
}
