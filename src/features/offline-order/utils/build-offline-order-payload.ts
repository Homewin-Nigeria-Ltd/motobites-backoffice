import type {
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  CreateOfflineOrderPayload,
  SaveOfflineOrderPayload,
} from "../types"

export function buildOfflineOrderPayload(
  items: OfflineOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
): CreateOfflineOrderPayload {
  const customerName = checkout.customerName.trim()
  const customerPhone = checkout.customerPhone.trim()
  const notes = checkout.managerVerificationNotes.trim()

  return {
    items: items.map((item) => ({
      menu_item_id: Number(item.itemId),
      quantity: item.quantity,
      ...(item.addons?.length
        ? { modifier_ids: item.addons.map((addon) => addon.id) }
        : {}),
    })),
    ...(customerName ? { customer_name: customerName } : {}),
    ...(customerPhone ? { customer_phone: customerPhone } : {}),
    payment_method: checkout.paymentMethod,
    order_source: checkout.orderSource,
    ...(notes ? { notes } : {}),
  }
}

export function buildSaveOfflineOrderPayload(
  items: OfflineOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
): SaveOfflineOrderPayload {
  return buildOfflineOrderPayload(items, checkout)
}
