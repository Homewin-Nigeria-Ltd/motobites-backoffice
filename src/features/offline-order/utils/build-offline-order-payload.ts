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
  const customerName = checkout.customerName.trim()
  const customerPhone = checkout.customerPhone.trim()
  const notes = checkout.managerVerificationNotes.trim()
  const branchId = checkout.branchId ? Number(checkout.branchId) : undefined

  return {
    items: items.map(buildOrderItemPayload),
    payment_method: checkout.paymentMethod,
    order_source: checkout.orderSource,
    ...(customerName ? { customer_name: customerName } : {}),
    ...(customerPhone ? { customer_phone: customerPhone } : {}),
    ...(branchId ? { fulfillment_branch_id: branchId, branch_id: branchId } : {}),
    ...(notes ? { notes } : {}),
  }
}

export function buildSaveOfflineOrderPayload(
  items: OfflineOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
): SaveOfflineOrderPayload {
  return buildOfflineOrderPayload(items, checkout)
}
