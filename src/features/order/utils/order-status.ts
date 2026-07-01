import { OrderStatus } from "@/features/order/enums/order-status"

const ORDER_STATUS_VALUES = new Set<string>(Object.values(OrderStatus))

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_VALUES.has(value)
}

function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatOrderStatusKey(status: string) {
  return capitalizeFirstLetter(status.replace(/_/g, " "))
}

export function getOrderStatusLabel(
  status: string,
  displayStatus?: string
): string {
  const label = displayStatus ?? status.replace(/_/g, " ")
  return capitalizeFirstLetter(label)
}
