import type {
  ApiSalesDashboardMenuItem,
  ApiSalesDashboardMenuItemModifier,
  ApiSalesDashboardMenuItemModifierGroup,
  OfflineOrderCartAddon,
  OfflineOrderCartItem,
} from "../types"

export function getMenuItemModifierGroups(item: ApiSalesDashboardMenuItem) {
  return (item.modifier_groups ?? []).filter(
    (group) => getActiveModifierOptions(group).length > 0,
  )
}

export function menuItemHasAddonOptions(item: ApiSalesDashboardMenuItem) {
  return getMenuItemModifierGroups(item).length > 0
}

export function getActiveModifierOptions(
  group: ApiSalesDashboardMenuItemModifierGroup,
) {
  return group.options.filter((option) => option.is_active)
}

export function buildCartLineId(itemId: string, addonIds: number[]) {
  if (addonIds.length === 0) {
    return itemId
  }

  return `${itemId}:${[...addonIds].sort((a, b) => a - b).join("-")}`
}

export function buildEmptyModifierSelections(
  groups: ApiSalesDashboardMenuItemModifierGroup[],
) {
  return Object.fromEntries(
    groups.map((group) => [group.group_name, [] as number[]]),
  )
}

export function modifierSelectionsFromAddons(
  groups: ApiSalesDashboardMenuItemModifierGroup[],
  addons: OfflineOrderCartAddon[] = [],
) {
  const selections = buildEmptyModifierSelections(groups)

  for (const addon of addons) {
    const group = groups.find((entry) => entry.group_name === addon.groupName)
    if (!group || selections[group.group_name].length > 0) {
      continue
    }

    selections[group.group_name] = [addon.id]
  }

  return selections
}

export function areModifierSelectionsEqual(
  left: Record<string, number[]>,
  right: Record<string, number[]>,
) {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)])

  for (const key of keys) {
    const leftValues = [...(left[key] ?? [])].sort((a, b) => a - b)
    const rightValues = [...(right[key] ?? [])].sort((a, b) => a - b)

    if (leftValues.length !== rightValues.length) {
      return false
    }

    if (leftValues.some((value, index) => value !== rightValues[index])) {
      return false
    }
  }

  return true
}

export function shouldApplyAddonSelectionOnClose(
  initialSelections: Record<string, number[]>,
  currentSelections: Record<string, number[]>,
) {
  return !areModifierSelectionsEqual(initialSelections, currentSelections)
}

export function mapSelectedModifiersToAddons(
  groups: ApiSalesDashboardMenuItemModifierGroup[],
  selections: Record<string, number[]>,
): OfflineOrderCartAddon[] {
  const addons: OfflineOrderCartAddon[] = []

  for (const group of groups) {
    const selectedIds = selections[group.group_name] ?? []
    const options = getActiveModifierOptions(group)
    const optionId = selectedIds[0]

    if (!optionId) {
      continue
    }

    const option = options.find((entry) => entry.id === optionId)
    if (!option) {
      continue
    }

    addons.push(mapModifierToCartAddon(option, group.group_name))
  }

  return addons
}

export function mapModifierToCartAddon(
  modifier: ApiSalesDashboardMenuItemModifier,
  groupName: string,
): OfflineOrderCartAddon {
  return {
    id: modifier.id,
    name: modifier.name,
    price: modifier.additional_price || modifier.price || 0,
    groupName,
  }
}

export function getCartItemUnitPrice(
  basePrice: number,
  addons: OfflineOrderCartAddon[] = [],
) {
  return basePrice + addons.reduce((sum, addon) => sum + addon.price, 0)
}

export function getCartItemAddonSummary(addons: OfflineOrderCartAddon[] = []) {
  return addons.map((addon) => addon.name).join(", ")
}

export function isModifierSelectionValid(
  groups: ApiSalesDashboardMenuItemModifierGroup[],
  selections: Record<string, number[]>,
) {
  return groups.every((group) => {
    const selected = selections[group.group_name] ?? []
    const minSelect = group.is_required
      ? Math.max(group.min_select, 1)
      : group.min_select

    if (selected.length < minSelect) {
      return false
    }

    if (selected.length > group.max_select) {
      return false
    }

    return true
  })
}

export function normalizeCartItem(item: OfflineOrderCartItem): OfflineOrderCartItem {
  const addons = item.addons ?? []
  const basePrice = item.basePrice ?? item.price
  const lineId =
    item.lineId ?? buildCartLineId(item.itemId, addons.map((addon) => addon.id))
  const price = getCartItemUnitPrice(basePrice, addons)

  return {
    ...item,
    lineId,
    addons,
    basePrice,
    price,
  }
}

export function normalizeCartItems(items: OfflineOrderCartItem[]) {
  return consolidateCartLinesByItemId(items.map(normalizeCartItem))
}

function consolidateCartLinesByItemId(items: OfflineOrderCartItem[]) {
  const linesByItemId = new Map<string, OfflineOrderCartItem[]>()

  for (const line of items) {
    const group = linesByItemId.get(line.itemId) ?? []
    group.push(line)
    linesByItemId.set(line.itemId, group)
  }

  const consolidated: OfflineOrderCartItem[] = []

  for (const lines of linesByItemId.values()) {
    const addonLines = lines.filter((line) => (line.addons?.length ?? 0) > 0)
    const baseLines = lines.filter((line) => !(line.addons?.length ?? 0))

    if (addonLines.length > 0) {
      consolidated.push(normalizeCartItem(addonLines[addonLines.length - 1]))
      continue
    }

    const byLineId = new Map<string, OfflineOrderCartItem>()

    for (const line of baseLines) {
      const existing = byLineId.get(line.lineId)

      if (!existing) {
        byLineId.set(line.lineId, line)
        continue
      }

      byLineId.set(line.lineId, {
        ...existing,
        quantity: existing.quantity + line.quantity,
      })
    }

    consolidated.push(...Array.from(byLineId.values()).map(normalizeCartItem))
  }

  return consolidated
}
