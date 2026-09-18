import type {
  ApiOfflineOrder,
  ApiSalesDashboardOrder,
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  OfflineOrderReceipt,
} from "../types"
import {
  getSalesDashboardOrderAssignedTo,
  getSalesDashboardOrderReference,
  getSalesDashboardOrderTotal,
  mapSalesDashboardOrderItemsToCart,
} from "./sales-dashboard-order"
import { normalizePaymentMethodFromApi } from "./order-checkout"
import {
  calculateOfflineOrderTotals,
  generateOfflineOrderNumber,
  resolveOfflineOrderAmount,
} from "./order-totals"

type MapOfflineOrderReceiptInput = {
  apiOrder: ApiOfflineOrder
  items: OfflineOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  takenByName: string
}

function resolveOrderId(order: ApiOfflineOrder | ApiSalesDashboardOrder) {
  if ("id" in order && order.id != null) {
    return String(order.id)
  }

  if ("order_id" in order && order.order_id != null) {
    return String(order.order_id)
  }

  return ""
}

function resolveCustomerName(order: ApiSalesDashboardOrder) {
  return (
    order.customer_name?.trim() ||
    order.customer?.name?.trim() ||
    "Walk-in Customer"
  )
}

function resolveCustomerPhone(order: ApiSalesDashboardOrder) {
  return order.customer_phone?.trim() || order.customer?.phone?.trim() || ""
}

function resolvePaymentMethod(order: ApiSalesDashboardOrder) {
  const method = order.payment?.channel ?? order.payment_method ?? "cash"

  return normalizePaymentMethodFromApi(method)
}

export function mapSalesDashboardOrderToReceipt(
  order: ApiSalesDashboardOrder,
): OfflineOrderReceipt {
  const items = mapSalesDashboardOrderItemsToCart(order)
  const subtotal =
    resolveOfflineOrderAmount(order.subtotal, order.subtotal_kobo) ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee =
    resolveOfflineOrderAmount(order.service_fee, order.service_fee_kobo) ||
    calculateOfflineOrderTotals(subtotal).serviceFee
  const total = getSalesDashboardOrderTotal(order) || subtotal + serviceFee

  return {
    orderId: resolveOrderId(order),
    orderNumber: getSalesDashboardOrderReference(order).replace(/^#/, ""),
    items,
    customerName: resolveCustomerName(order),
    customerPhone: resolveCustomerPhone(order),
    paymentMethod: resolvePaymentMethod(order),
    takenByName: getSalesDashboardOrderAssignedTo(order),
    branchName: order.fulfillment_branch?.name ?? null,
    subtotal,
    serviceFee,
    total,
    placedAt:
      order.ordered_at ??
      order.payment?.paid_at ??
      order.completed_at ??
      order.created_at ??
      new Date().toISOString(),
  }
}

export function mapOfflineOrderReceipt({
  apiOrder,
  items,
  checkout,
  takenByName,
}: MapOfflineOrderReceiptInput): OfflineOrderReceipt {
  const localTotals = calculateOfflineOrderTotals(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const subtotal = apiOrder.subtotal ?? localTotals.subtotal
  const serviceFee = apiOrder.service_fee ?? localTotals.serviceFee
  const total =
    apiOrder.total ?? apiOrder.total_amount ?? subtotal + serviceFee

  return {
    orderId: resolveOrderId(apiOrder),
    orderNumber:
      apiOrder.reference_number ??
      apiOrder.order_number ??
      (apiOrder.order_id != null ? String(apiOrder.order_id) : undefined) ??
      generateOfflineOrderNumber(),
    items,
    customerName:
      apiOrder.customer_name?.trim() ||
      checkout.customerName.trim() ||
      "Walk-in Customer",
    customerPhone:
      apiOrder.customer_phone?.trim() || checkout.customerPhone.trim(),
    paymentMethod: apiOrder.payment_method
      ? normalizePaymentMethodFromApi(apiOrder.payment_method)
      : checkout.paymentMethod,
    takenByName,
    branchName: checkout.branchName || null,
    subtotal,
    serviceFee,
    total,
    placedAt: new Date().toISOString(),
  }
}
