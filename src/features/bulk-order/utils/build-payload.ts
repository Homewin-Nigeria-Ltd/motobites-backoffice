import type { OfflineOrderCheckoutDraft } from "@/features/offline-order/types"

import type {
  BulkOrderAllocationRole,
  BulkOrderCartItem,
  BulkOrderLineType,
  BulkOrderSource,
  CreateBulkOrderAddonPayload,
  CreateBulkOrderItemPayload,
  CreateBulkOrderPayload,
} from "../types"

export const ADDON_ITEM_ID_PATTERN = /^addon-(\d+)-(\d+)$/

export function resolveBulkMenuItemId(item: Pick<BulkOrderCartItem, "itemId" | "menuItemId">) {
  if (typeof item.menuItemId === "number" && Number.isFinite(item.menuItemId)) {
    const addonMatch = item.itemId.match(ADDON_ITEM_ID_PATTERN)
    if (addonMatch) {
      return Number(addonMatch[1])
    }

    return item.menuItemId
  }

  const addonMatch = item.itemId.match(ADDON_ITEM_ID_PATTERN)
  if (addonMatch) {
    return Number(addonMatch[1])
  }

  return Number(item.itemId)
}

export function resolveBulkLineType(item: BulkOrderCartItem): BulkOrderLineType {
  if (item.lineType && item.lineType !== "primary") {
    return item.lineType
  }

  if (item.allocationRole === "combo") {
    return "primary"
  }

  if (item.allocationRole && item.allocationRole !== "primary") {
    return item.allocationRole
  }

  const label = item.categoryName.toLowerCase()
  if (/drink|refresh|cola|water/.test(label)) {
    return "drink"
  }
  if (/protein/.test(label)) {
    return "protein"
  }
  if (item.kind === "side" || /side|addon|add-on|snack/.test(label)) {
    return "side"
  }

  return item.lineType || "primary"
}

export function resolveBulkAllocationRole(
  item: BulkOrderCartItem,
): BulkOrderAllocationRole {
  if (item.allocationRole) {
    return item.allocationRole
  }

  return resolveBulkLineType(item)
}

function parseAddonCartLine(item: BulkOrderCartItem) {
  const match = item.itemId.match(ADDON_ITEM_ID_PATTERN)
  if (!match) {
    return null
  }

  return {
    parentMenuItemId: Number(match[1]),
    addonId: Number(match[2]),
    quantity: item.quantity,
    allocationRole:
      item.allocationRole === "primary" || item.allocationRole === "combo"
        ? undefined
        : item.allocationRole,
  }
}

function toAddonPayload(addon: CreateBulkOrderAddonPayload): CreateBulkOrderAddonPayload {
  return {
    id: addon.id,
    quantity: addon.quantity,
    ...(addon.allocation_role ? { allocation_role: addon.allocation_role } : {}),
  }
}

function buildGroupedItems(items: BulkOrderCartItem[]): CreateBulkOrderItemPayload[] {
  const grouped = new Map<
    number,
    {
      primary?: BulkOrderCartItem
      addons: CreateBulkOrderAddonPayload[]
    }
  >()

  const ensureGroup = (menuItemId: number) => {
    const existing = grouped.get(menuItemId)
    if (existing) {
      return existing
    }

    const next: {
      primary?: BulkOrderCartItem
      addons: CreateBulkOrderAddonPayload[]
    } = { addons: [] }
    grouped.set(menuItemId, next)
    return next
  }

  for (const item of items) {
    const addonLine = parseAddonCartLine(item)

    if (addonLine) {
      const group = ensureGroup(addonLine.parentMenuItemId)
      const existingAddon = group.addons.find((addon) => addon.id === addonLine.addonId)

      if (existingAddon) {
        existingAddon.quantity += addonLine.quantity
      } else {
        group.addons.push(
          toAddonPayload({
            id: addonLine.addonId,
            quantity: addonLine.quantity,
            allocation_role: addonLine.allocationRole,
          }),
        )
      }
      continue
    }

    const menuItemId = resolveBulkMenuItemId(item)
    const group = ensureGroup(menuItemId)
    group.primary = item

    for (const addon of item.addons ?? []) {
      const existingAddon = group.addons.find((entry) => entry.id === addon.id)
      if (existingAddon) {
        existingAddon.quantity += 1
        continue
      }

      group.addons.push(
        toAddonPayload({
          id: addon.id,
          quantity: 1,
          allocation_role: addon.allocationRole,
        }),
      )
    }
  }

  return [...grouped.entries()].map(([menuItemId, group]) => {
    const primary = group.primary
    const maxAddonQty = group.addons.reduce(
      (sum, addon) => Math.max(sum, addon.quantity),
      0,
    )
    const quantity = primary?.quantity
      ? primary.quantity
      : Math.max(1, maxAddonQty)
    const allocationRole = primary
      ? resolveBulkAllocationRole(primary)
      : "primary"

    return {
      menu_item_id: menuItemId,
      quantity,
      allocation_role: allocationRole,
      type: allocationRole,
      ...(group.addons.length > 0
        ? {
            addons: group.addons,
            add_ons: group.addons,
            add_on_ids: group.addons.map((addon) => addon.id),
          }
        : {}),
    }
  })
}

export function buildBulkOrderPayload(
  items: BulkOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
  source: BulkOrderSource,
): CreateBulkOrderPayload {
  const customerName = checkout.customerName.trim()
  const customerPhone = checkout.customerPhone.trim()
  const notes = checkout.managerVerificationNotes.trim()
  const promoCode = checkout.promoCode?.trim() ?? ""
  const branchId = checkout.branchId ? Number(checkout.branchId) : undefined

  return {
    items: buildGroupedItems(items),
    payment_method: checkout.paymentMethod,
    order_source: source,
    source,
    ...(customerName ? { customer_name: customerName } : {}),
    ...(customerPhone ? { customer_phone: customerPhone } : {}),
    ...(branchId
      ? { fulfillment_branch_id: branchId, branch_id: branchId }
      : {}),
    ...(notes ? { notes } : {}),
    ...(promoCode ? { promo_code: promoCode, coupon_code: promoCode } : {}),
  }
}

export function buildSaveBulkOrderPayload(
  items: BulkOrderCartItem[],
  checkout: OfflineOrderCheckoutDraft,
  source: BulkOrderSource,
) {
  return buildBulkOrderPayload(items, checkout, source)
}
