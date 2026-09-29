import type { ApiSalesDashboardKitchen } from "@/features/offline-order/types"
import {
  getActiveModifierOptions,
  getMenuItemModifierGroups,
} from "@/features/offline-order/utils/cart-line"

import {
  ALL_BULK_ORDER_CATEGORY_ID,
  ALL_BULK_ORDER_KITCHEN_ID,
} from "../constants"
import type {
  BulkOrderAddon,
  BulkOrderCatalogGroup,
  BulkOrderCatalogItem,
  BulkOrderCategory,
  BulkOrderItemKind,
} from "../types"

export function getBulkOrderUnitPrice(
  basePrice: number,
  addons: BulkOrderAddon[] = [],
) {
  return basePrice + addons.reduce((sum, addon) => sum + addon.price, 0)
}

const SIDE_CATEGORY_PATTERN =
  /drink|refresh|side|protein|addon|add-on|cola|water|snack/i

export function getBulkOrderItemKind(categoryName: string): BulkOrderItemKind {
  return SIDE_CATEGORY_PATTERN.test(categoryName) ? "side" : "portion"
}

export function getBulkOrderAllocationLabel(categoryName: string) {
  if (/drink|refresh|cola|water/i.test(categoryName)) {
    return "Refresher"
  }

  if (getBulkOrderItemKind(categoryName) === "side") {
    return "Side Allocation"
  }

  return "Main Portion"
}

export function flattenBulkOrderCatalog(
  kitchens: ApiSalesDashboardKitchen[],
): BulkOrderCatalogItem[] {
  return kitchens.flatMap((kitchen) =>
    (kitchen.menu_items ?? []).map((item) => {
      const categoryName = item.category?.name?.trim() || "Other Items"

      return {
        id: String(item.id),
        name: item.name,
        price: item.price,
        image: item.image,
        kitchenId: String(kitchen.id),
        kitchenName: kitchen.name,
        categoryId: String(item.category?.id ?? categoryName),
        categoryName,
        kind: getBulkOrderItemKind(categoryName),
        lineType: getBulkOrderItemKind(categoryName) === "side" ? "side" : "primary",
        menuItemId: item.id,
        allocationRole:
          getBulkOrderItemKind(categoryName) === "side" ? "side" : "primary",
        addonGroups: getMenuItemModifierGroups(item).map((group) => ({
          name: group.display_name || group.group_name,
          options: getActiveModifierOptions(group).map((option) => ({
            id: option.id,
            menuItemId: option.id,
            name: option.name,
            price: option.additional_price || option.price || 0,
            groupName: group.group_name,
          })),
        })),
      }
    }),
  )
}

export function getBulkOrderCategories(
  items: BulkOrderCatalogItem[],
): BulkOrderCategory[] {
  const categories = new Map<string, string>()

  for (const item of items) {
    if (!categories.has(item.categoryId)) {
      categories.set(item.categoryId, item.categoryName)
    }
  }

  return [
    { id: ALL_BULK_ORDER_CATEGORY_ID, label: "All Items" },
    ...[...categories.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ]
}

export function filterBulkOrderCatalog(
  items: BulkOrderCatalogItem[],
  search: string,
  kitchenId: string,
) {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesKitchen =
      kitchenId === ALL_BULK_ORDER_KITCHEN_ID || item.kitchenId === kitchenId
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.categoryName.toLowerCase().includes(query) ||
      item.kitchenName.toLowerCase().includes(query)

    return matchesKitchen && matchesSearch
  })
}

export function groupBulkOrderCatalog(
  items: BulkOrderCatalogItem[],
): BulkOrderCatalogGroup[] {
  const groups = new Map<string, BulkOrderCatalogGroup>()

  for (const item of items) {
    const existing = groups.get(item.categoryId)

    if (existing) {
      existing.items.push(item)
      continue
    }

    groups.set(item.categoryId, {
      id: item.categoryId,
      title: item.categoryName,
      items: [item],
    })
  }

  return [...groups.values()].sort((a, b) => a.title.localeCompare(b.title))
}

export function getBulkOrderAddonSections(
  selectedItem: BulkOrderCatalogItem | undefined,
  sideItems: BulkOrderCatalogItem[],
): BulkOrderCatalogGroup[] {
  const fromSelectedItem =
    selectedItem?.addonGroups
      .filter((group) => group.options.length > 0)
      .map((group, index) => {
        const lineType =
          /drink|refresh|cola|water/i.test(group.name)
            ? ("drink" as const)
            : /protein/i.test(group.name)
              ? ("protein" as const)
              : ("side" as const)

        return {
          id: `${selectedItem.id}-${group.name}-${index}`,
          title: group.name,
          items: group.options.map((option) => ({
            id: `addon-${selectedItem.menuItemId}-${option.id}`,
            menuItemId: selectedItem.menuItemId,
            name: option.name,
            price: option.price,
            image: selectedItem.image,
            kitchenId: selectedItem.kitchenId,
            kitchenName: selectedItem.kitchenName,
            categoryId: group.name,
            categoryName: group.name,
            kind: "side" as const,
            lineType,
            allocationRole: option.allocationRole ?? lineType,
            addonGroups: [],
          })),
        }
      }) ?? []

  if (fromSelectedItem.length > 0) {
    return fromSelectedItem
  }

  return groupBulkOrderCatalog(sideItems)
}
