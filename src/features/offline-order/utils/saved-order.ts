import type {
  OfflineOrderCartItem,
  OfflineOrderSavedOrder,
} from "../types"
import { calculateOfflineOrderTotals } from "./order-totals"

export function getSavedOrderItemCount(items: OfflineOrderCartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getSavedOrderSubtotal(items: OfflineOrderCartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getSavedOrderTotal(items: OfflineOrderCartItem[]) {
  return calculateOfflineOrderTotals(getSavedOrderSubtotal(items)).total
}

export function getSavedOrderCustomerName(order: OfflineOrderSavedOrder) {
  const name = order.checkout.customerName.trim()
  return name || "Walk-in Customer"
}

export function formatTimeSaved(savedAt: string) {
  const savedDate = new Date(savedAt)
  const diffMs = Date.now() - savedDate.getTime()

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "Just now"
  }

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) {
    return "Just now"
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function filterSavedOrders(
  orders: OfflineOrderSavedOrder[],
  search: string,
) {
  const query = search.trim().toLowerCase()
  if (!query) {
    return orders
  }

  return orders.filter((order) => {
    const customerName = getSavedOrderCustomerName(order).toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      customerName.includes(query)
    )
  })
}

export function sortSavedOrders(
  orders: OfflineOrderSavedOrder[],
  sort: "time_saved" | "total_amount" | "customer",
) {
  const next = [...orders]

  switch (sort) {
    case "total_amount":
      return next.sort(
        (a, b) => getSavedOrderTotal(b.items) - getSavedOrderTotal(a.items),
      )
    case "customer":
      return next.sort((a, b) =>
        getSavedOrderCustomerName(a).localeCompare(getSavedOrderCustomerName(b)),
      )
    case "time_saved":
    default:
      return next.sort(
        (a, b) =>
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
      )
  }
}
