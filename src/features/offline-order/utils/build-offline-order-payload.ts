import type {
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
  CreateOfflineOrderItemPayload,
  CreateOfflineOrderPayload,
  SaveOfflineOrderPayload,
} from "../types"

function buildOrderItemPayload(
  item: OfflineOrderCartItem,
): CreateOfflineOrderItemPayload {
  const payload: CreateOfflineOrderItemPayload = {
    menu_item_id: Number(item.itemId),
    quantity: item.quantity,
  }

  if (!item.addons?.length) {
    return payload
  }

  const addonPayload = item.addons.map((addon) => ({
    id: addon.id,
    quantity: 1,
  }))

  return {
    ...payload,
    addons: addonPayload,
    add_ons: addonPayload,
    add_on_ids: item.addons.map((addon) => addon.id),
    modifiers: item.addons.map(() => ({})),
  }
}

export function buildOfflineOrderPayload(
  items: OfflineOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
): CreateOfflineOrderPayload {
  return {
    items: items.map(buildOrderItemPayload),
    customer_name: checkout.customerName.trim(),
    customer_phone: checkout.customerPhone.trim(),
    payment_method: checkout.paymentMethod,
    order_source: checkout.orderSource,
    notes: checkout.managerVerificationNotes.trim(),
  }
}

export function buildSaveOfflineOrderPayload(
  items: OfflineOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
): SaveOfflineOrderPayload {
  return buildOfflineOrderPayload(items, checkout)
}
