import type {
  ApiSalesDashboardOrder,
  ApiSalesDashboardOrderItem,
  OfflineOrderCartAddon,
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  OfflineOrderOverviewOrderRow,
  OfflineOrderSavedSort,
} from "../types"
import { formatTimeSaved } from "./saved-order"
import { buildCartLineId, getCartItemUnitPrice } from "./cart-line"
import {
  normalizeOrderSourceFromApi,
  normalizePaymentMethodFromApi,
} from "./order-checkout"
import { resolveOfflineOrderAmount } from "./order-totals"

export function getSalesDashboardOrderStatus(order: ApiSalesDashboardOrder) {
  return (order.status ?? order.display_status ?? "").toLowerCase()
}

export function getSalesDashboardOrderReference(order: ApiSalesDashboardOrder) {
  return order.reference_number ?? order.order_number ?? String(order.id)
}

export function getSalesDashboardOrderTotal(order: ApiSalesDashboardOrder) {
  return (
    resolveOfflineOrderAmount(null, order.total_kobo) ||
    resolveOfflineOrderAmount(order.total ?? order.total_amount, null)
  )
}

export function getSalesDashboardOrderDiscount(order: ApiSalesDashboardOrder) {
  return (
    resolveOfflineOrderAmount(null, order.discount_kobo) ||
    resolveOfflineOrderAmount(order.discount ?? order.discount_amount, null)
  )
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
    discount: getSalesDashboardOrderDiscount(order),
    timeLabel: getSalesDashboardOrderTimeLabel(order),
  }
}


type SavedOrderItemModifier = {
  id?: number
  name?: string
  group_name?: string
  price?: number
  additional_price?: number
  price_kobo?: number
}

function resolveSavedOrderModifierPrice(modifier: SavedOrderItemModifier) {
  if (
    typeof modifier.additional_price === "number" &&
    modifier.additional_price > 0
  ) {
    return modifier.additional_price
  }

  if (typeof modifier.price === "number") {
    return modifier.price
  }

  if (typeof modifier.price_kobo === "number") {
    return modifier.price_kobo / 100
  }

  return 0
}

function mapOrderItemModifiersToAddons(
  item: ApiSalesDashboardOrderItem,
): OfflineOrderCartAddon[] {
  const sources = [...(item.modifiers ?? []), ...(item.addons ?? [])]

  return sources
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null
      }

      const modifier = entry as SavedOrderItemModifier
      const id = modifier.id
      const name = modifier.name?.trim()

      if (!id || !name) {
        return null
      }

      return {
        id,
        name,
        price: resolveSavedOrderModifierPrice(modifier),
        groupName: modifier.group_name?.trim() || "Add-ons",
      }
    })
    .filter((addon): addon is OfflineOrderCartAddon => addon !== null)
}

function getItemBasePrice(
  item: ApiSalesDashboardOrderItem,
  addons: OfflineOrderCartAddon[],
) {
  const addonTotal = addons.reduce((sum, addon) => sum + addon.price, 0)

  if (typeof item.unit_price === "number") {
    return item.unit_price
  }

  if (typeof item.unit_price === "string") {
    const parsed = Number(item.unit_price)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  if (typeof item.price === "number") {
    return item.price
  }

  if (typeof item.subtotal === "number" && item.quantity > 0) {
    return Math.max(0, item.subtotal / item.quantity - addonTotal)
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
    const addons = mapOrderItemModifiersToAddons(item)
    const basePrice = getItemBasePrice(item, addons)
    const addonIds = addons.map((addon) => addon.id)

    return {
      lineId: buildCartLineId(itemId, addonIds),
      itemId,
      name: item.name,
      basePrice,
      price: getCartItemUnitPrice(basePrice, addons),
      image: item.image ?? null,
      kitchenId: String(
        item.kitchen?.id ?? item.kitchen_id ?? order.kitchen?.id ?? "",
      ),
      kitchenName:
        item.kitchen?.name ??
        item.kitchen_name ??
        order.kitchen?.name ??
        "",
      quantity: item.quantity,
      addons,
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
    promoCode: order.promo_code?.trim() || order.coupon_code?.trim() || "",
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
