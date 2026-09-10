import type {
  ApiSalesDashboardOrder,
  ApiSalesDashboardOrderItem,
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  OfflineOrderOverviewOrderRow,
  OfflineOrderSavedSort,
} from "../types"
import { formatTimeSaved } from "./saved-order"
import { buildCartLineId } from "./cart-line"
import {
  normalizeOrderSourceFromApi,
  normalizePaymentMethodFromApi,
} from "./order-checkout"

export function getSalesDashboardOrderStatus(order: ApiSalesDashboardOrder) {
  return (order.status ?? order.display_status ?? "").toLowerCase()
}

export function getSalesDashboardOrderReference(order: ApiSalesDashboardOrder) {
  return order.reference_number ?? order.order_number ?? String(order.id)
}

export function getSalesDashboardOrderTotal(order: ApiSalesDashboardOrder) {
  if (typeof order.total_kobo === "number") {
    return order.total_kobo / 100
  }

  if (typeof order.total === "number") {
    return order.total
  }

  if (typeof order.total_amount === "number") {
    return order.total_amount
  }

  if (typeof order.amount_paid === "number") {
    return order.amount_paid
  }

  return 0
}

export function getSalesDashboardOrderItemCount(order: ApiSalesDashboardOrder) {
  if (typeof order.items_count === "number") {
    return order.items_count
  }

  return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

export function getSalesDashboardOrderAssignedTo(order: ApiSalesDashboardOrder) {
  return (
    order.sales_rep?.name?.trim() ||
    order.assigned_to?.name?.trim() ||
    order.taken_by?.name?.trim() ||
    "Unassigned"
  )
}

function isRelativeTimeLabel(value: string) {
  return /\bago\b/i.test(value) || value.trim().toLowerCase() === "just now"
}

function getOrderSortTimestamp(order: ApiSalesDashboardOrder) {
  const timestamps = [
    order.ordered_at,
    order.saved_at,
    order.completed_at,
    order.updated_at,
    order.created_at,
  ]

  for (const value of timestamps) {
    if (!value) {
      continue
    }

    const parsed = new Date(value).getTime()
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return 0
}

export function getSalesDashboardOrderDateLabel(order: ApiSalesDashboardOrder) {
  const orderDate = order.order_date?.trim()
  const orderTime = order.order_time?.trim()

  if (orderDate && orderTime) {
    return `${orderDate} · ${orderTime}`
  }

  if (orderDate) {
    return orderDate
  }

  if (order.ordered_at) {
    const parsed = new Date(order.ordered_at)

    if (!Number.isNaN(parsed.getTime())) {
      const date = parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      const time = parsed.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      return `${date} · ${time}`
    }
  }

  return null
}

export function getSalesDashboardOrderTimeLabel(order: ApiSalesDashboardOrder) {
  const orderDateLabel = getSalesDashboardOrderDateLabel(order)

  if (orderDateLabel) {
    return orderDateLabel
  }

  if (order.time_ago?.trim()) {
    return order.time_ago.trim()
  }

  if (order.time_saved && isRelativeTimeLabel(order.time_saved)) {
    return order.time_saved
  }

  const timestamp =
    order.ordered_at ??
    order.saved_at ??
    order.completed_at ??
    order.updated_at ??
    order.created_at

  if (!timestamp) {
    return order.time_saved ?? "Just now"
  }

  return formatTimeSaved(timestamp)
}

export function isSavedOnHoldOrder(order: ApiSalesDashboardOrder) {
  if (order.saved_at) {
    return !isCompletedSalesDashboardOrder(order)
  }

  const status = getSalesDashboardOrderStatus(order)

  if (isCompletedSalesDashboardOrder(order)) {
    return false
  }

  return (
    status.includes("hold") ||
    status.includes("saved") ||
    status === "on_hold" ||
    status === "pending" ||
    status === "draft"
  )
}

export function isActiveSalesDashboardOrder(order: ApiSalesDashboardOrder) {
  const status = getSalesDashboardOrderStatus(order)

  if (isSavedOnHoldOrder(order) || isCompletedSalesDashboardOrder(order)) {
    return false
  }

  return (
    status.includes("process") ||
    status.includes("active") ||
    status.includes("preparing")
  )
}

export function isCompletedSalesDashboardOrder(order: ApiSalesDashboardOrder) {
  const status = getSalesDashboardOrderStatus(order)

  return (
    status.includes("complete") ||
    status.includes("paid") ||
    status.includes("delivered")
  )
}

export function mapSalesDashboardOrderToOverviewRow(
  order: ApiSalesDashboardOrder,
): OfflineOrderOverviewOrderRow {
  return {
    id: String(order.id),
    orderNumber: getSalesDashboardOrderReference(order).replace(/^#/, ""),
    customerName: order.customer_name?.trim() || "Walk-in Customer",
    itemsCount: getSalesDashboardOrderItemCount(order),
    total: getSalesDashboardOrderTotal(order),
    timeLabel: getSalesDashboardOrderTimeLabel(order),
  }
}


function getItemUnitPrice(item: ApiSalesDashboardOrderItem) {
  if (typeof item.unit_price === "number") {
    return item.unit_price
  }

  if (typeof item.unit_price === "string") {
    return Number(item.unit_price)
  }

  if (typeof item.price === "number") {
    return item.price
  }

  if (typeof item.subtotal === "number" && item.quantity > 0) {
    return item.subtotal / item.quantity
  }

  return 0
}

export function mapSalesDashboardOrderItemsToCart(
  order: ApiSalesDashboardOrder,
): OfflineOrderCartItem[] {
  if (!order.items?.length) {
    return []
  }

  return order.items.map((item, index) => {
    const itemId = String(item.menu_item_id ?? item.id ?? index)
    const price = getItemUnitPrice(item)

    return {
      lineId: buildCartLineId(itemId, []),
      itemId,
      name: item.name,
      basePrice: price,
      price,
      image: item.image ?? null,
      kitchenId: String(item.kitchen_id ?? order.kitchen?.id ?? ""),
      kitchenName: item.kitchen_name ?? order.kitchen?.name ?? "",
      quantity: item.quantity,
      addons: [],
    }
  })
}

export function mapSalesDashboardOrderToCheckout(
  order: ApiSalesDashboardOrder,
): OfflineOrderCheckoutDraft {
  return {
    customerName: order.customer_name?.trim() ?? "",
    customerPhone: order.customer_phone?.trim() ?? "",
    orderSource: normalizeOrderSourceFromApi(order.order_source),
    paymentMethod: normalizePaymentMethodFromApi(order.payment_method),
    takenById: order.sales_rep?.id
      ? String(order.sales_rep.id)
      : order.assigned_to?.id
        ? String(order.assigned_to.id)
        : "",
    takenByName: getSalesDashboardOrderAssignedTo(order),
    managerVerificationNotes: "",
  }
}

export function filterSalesDashboardOrders(
  orders: ApiSalesDashboardOrder[],
  search: string,
) {
  const query = search.trim().toLowerCase()

  if (!query) {
    return orders
  }

  return orders.filter((order) => {
    const reference = getSalesDashboardOrderReference(order).toLowerCase()
    const customer = order.customer_name?.toLowerCase() ?? ""

    return reference.includes(query) || customer.includes(query)
  })
}

export function sortSalesDashboardOrders(
  orders: ApiSalesDashboardOrder[],
  sort: OfflineOrderSavedSort,
) {
  const next = [...orders]

  switch (sort) {
    case "total_amount":
      return next.sort(
        (a, b) =>
          getSalesDashboardOrderTotal(b) - getSalesDashboardOrderTotal(a),
      )
    case "customer":
      return next.sort((a, b) =>
        (a.customer_name ?? "").localeCompare(b.customer_name ?? ""),
      )
    case "time_saved":
    default:
      return next.sort(
        (a, b) => getOrderSortTimestamp(b) - getOrderSortTimestamp(a),
      )
  }
}

export function getSalesDashboardOrderStatusLabel(order: ApiSalesDashboardOrder) {
  return order.display_status ?? order.status ?? "placed"
}
