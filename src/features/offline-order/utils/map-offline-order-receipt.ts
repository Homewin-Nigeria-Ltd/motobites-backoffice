import type {
  ApiOfflineOrder,
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  OfflineOrderReceipt,
} from "../types"
import { normalizePaymentMethodFromApi } from "./order-checkout"
import { calculateOfflineOrderTotals, generateOfflineOrderNumber } from "./order-totals"

type MapOfflineOrderReceiptInput = {
  apiOrder: ApiOfflineOrder
  items: OfflineOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  takenByName: string
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
    orderNumber:
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
    subtotal,
    serviceFee,
    total,
    placedAt: new Date().toISOString(),
  }
}
