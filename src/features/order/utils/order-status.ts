import { ORDER_STATUS_LABELS, OrderStatus } from "@/features/order/enums/order-status"

const ORDER_STATUS_VALUES = new Set<string>(Object.values(OrderStatus))

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_VALUES.has(value)
}

export function getOrderStatusLabel(
  status: string,
  fallbackDisplayStatus?: string
): string {
  if (isOrderStatus(status)) {
    return ORDER_STATUS_LABELS[status]
  }

  return fallbackDisplayStatus ?? status
}
