import { resolveOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"

import type {
  BulkOrderAddon,
  BulkOrderAddonGroup,
  BulkOrderAllocationRole,
  BulkOrderCatalogItem,
  BulkOrderItemKind,
  BulkOrderLineType,
} from "../types"
import { getBulkOrderItemKind } from "./catalog"

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return null
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

function resolvePrice(item: Record<string, unknown>) {
  return (
    resolveOfflineOrderAmount(
      asNumber(item.price) ?? asNumber(item.additional_price),
      asNumber(item.price_kobo),
    ) || 0
  )
}

function resolveName(item: Record<string, unknown>) {
  return (
    asString(item.name).trim() ||
    asString(item.title).trim() ||
    "Menu item"
  )
}

function resolveKitchen(item: Record<string, unknown>) {
  const kitchen = asRecord(item.kitchen)
  const kitchenId =
    asNumber(item.kitchen_id) ??
    asNumber(kitchen?.id) ??
    asNumber(asRecord(item.kitchen)?.id)
  const kitchenName =
    asString(item.kitchen_name).trim() ||
    asString(kitchen?.name).trim() ||
    "Kitchen"

  return {
    kitchenId: kitchenId != null ? String(kitchenId) : "",
    kitchenName,
  }
}

function resolveCategory(item: Record<string, unknown>) {
  const category = asRecord(item.category)
  const categoryName =
    asString(item.category_name).trim() ||
    asString(category?.name).trim() ||
    asString(item.type).trim() ||
    asString(item.allocation_type).trim() ||
    "Other Items"
  const categoryId =
    asNumber(item.category_id) ??
    asNumber(category?.id) ??
    categoryName

  return {
    categoryId: String(categoryId),
    categoryName,
  }
}

export function resolveMenuItemId(item: Record<string, unknown>) {
  const nestedMenuItem = asRecord(item.menu_item)

  return (
    asNumber(item.menu_item_id) ??
    asNumber(nestedMenuItem?.id) ??
    asNumber(item.id)
  )
}

export function toBulkOrderLineType(
  role: BulkOrderAllocationRole,
): BulkOrderLineType {
  return role === "combo" ? "primary" : role
}

export function resolveBulkOrderAllocationRole(
  item: Record<string, unknown> | { categoryName?: string; kind?: BulkOrderItemKind },
  categoryName?: string,
): BulkOrderAllocationRole {
  const record = asRecord(item) ?? {}
  const rawType = asString(
    record.allocation_role ??
      record.role ??
      record.type ??
      record.allocation_type ??
      record.kind,
  ).toLowerCase()
  const label = (
    categoryName ??
    asString(record.categoryName) ??
    asString(record.category_name) ??
    asString(asRecord(record.category)?.name)
  ).toLowerCase()

  if (rawType === "combo") {
    return "combo"
  }

  if (rawType === "primary" || rawType === "main" || rawType === "portion") {
    return "primary"
  }

  if (rawType === "drink" || /drink|refresh|cola|water/.test(label)) {
    return "drink"
  }

  if (rawType === "protein" || /protein/.test(label)) {
    return "protein"
  }

  if (
    rawType === "side" ||
    rawType === "addon" ||
    /side|addon|add-on|snack/.test(label)
  ) {
    return "side"
  }

  if (record.is_combo === true) {
    return "combo"
  }

  if (record.is_primary === true) {
    return "primary"
  }

  return getBulkOrderItemKind(label || categoryName || "") === "side"
    ? "side"
    : "primary"
}

export function resolveBulkOrderLineType(
  item: Record<string, unknown> | { categoryName?: string; kind?: BulkOrderItemKind },
  categoryName?: string,
): BulkOrderLineType {
  return toBulkOrderLineType(resolveBulkOrderAllocationRole(item, categoryName))
}

function resolveKind(role: BulkOrderAllocationRole): BulkOrderItemKind {
  return toBulkOrderLineType(role) === "primary" ? "portion" : "side"
}

function mapAddonOption(
  option: unknown,
  groupName: string,
): BulkOrderAddon | null {
  const record = asRecord(option)
  if (!record) {
    return null
  }

  const id = asNumber(record.id)
  const name = resolveName(record)

  if (id == null) {
    return null
  }

  return {
    id,
    menuItemId: id,
    name,
    price: resolvePrice(record),
    groupName,
    allocationRole: resolveBulkOrderAllocationRole(record, groupName),
  }
}

function uniqueOptions(options: BulkOrderAddon[]) {
  const seen = new Set<number>()
  const unique: BulkOrderAddon[] = []

  for (const option of options) {
    if (seen.has(option.id)) {
      continue
    }

    seen.add(option.id)
    unique.push(option)
  }

  return unique
}

function addonGroupsFromCategorized(item: Record<string, unknown>) {
  const categories = item.addons_categorized
  if (!Array.isArray(categories) || categories.length === 0) {
    return []
  }

  return categories
    .map((category) => {
      const record = asRecord(category)
      if (!record) {
        return null
      }

      const name =
        asString(record.category_name).trim() ||
        asString(record.name).trim() ||
        "Add-ons"
      const items = Array.isArray(record.items) ? record.items : []
      const options = uniqueOptions(
        items
          .map((option) => mapAddonOption(option, name))
          .filter((option): option is BulkOrderAddon => option != null),
      )

      if (options.length === 0) {
        return null
      }

      return { name, options }
    })
    .filter((group): group is BulkOrderAddonGroup => group != null)
}

function addonGroupsFromNamedGroups(item: Record<string, unknown>) {
  for (const key of ["modifier_groups", "add_on_groups", "addon_groups"]) {
    const groups = item[key]
    if (!Array.isArray(groups) || groups.length === 0) {
      continue
    }

    const mapped = groups
      .map((group) => {
        const record = asRecord(group)
        if (!record) {
          return null
        }

        const name =
          asString(record.display_name).trim() ||
          asString(record.group_name).trim() ||
          "Add-ons"
        const optionsSource = [
          ...(Array.isArray(record.options) ? record.options : []),
          ...(Array.isArray(record.addons) ? record.addons : []),
        ]
        const options = uniqueOptions(
          optionsSource
            .filter((option) => {
              const optionRecord = asRecord(option)
              return optionRecord?.is_active !== false
            })
            .map((option) => mapAddonOption(option, name))
            .filter((option): option is BulkOrderAddon => option != null),
        )

        if (options.length === 0) {
          return null
        }

        return { name, options }
      })
      .filter((group): group is BulkOrderAddonGroup => group != null)

    if (mapped.length > 0) {
      return mapped
    }
  }

  return []
}

export function getBulkOrderAddonGroups(
  item: Record<string, unknown>,
): BulkOrderAddonGroup[] {
  const categorized = addonGroupsFromCategorized(item)
  if (categorized.length > 0) {
    return categorized
  }

  return addonGroupsFromNamedGroups(item)
}

export function mapBulkOrderMenuItem(item: unknown): BulkOrderCatalogItem | null {
  const record = asRecord(item)
  if (!record) {
    return null
  }

  const menuItemId = resolveMenuItemId(record)
  const catalogId = asNumber(record.id) ?? menuItemId
  if (menuItemId == null) {
    return null
  }

  const { categoryId, categoryName } = resolveCategory(record)
  const { kitchenId, kitchenName } = resolveKitchen(record)
  const allocationRole = resolveBulkOrderAllocationRole(record, categoryName)
  const lineType = toBulkOrderLineType(allocationRole)

  return {
    id: String(catalogId),
    menuItemId,
    name: resolveName(record),
    price: resolvePrice({
      ...record,
      price: record.current_price ?? record.price,
    }),
    image:
      asString(record.image).trim() ||
      asString(record.image_url).trim() ||
      null,
    kitchenId,
    kitchenName,
    categoryId,
    categoryName,
    kind: resolveKind(allocationRole),
    lineType,
    allocationRole,
    addonGroups: getBulkOrderAddonGroups(record),
  }
}

export function mapBulkOrderMenuItems(payload: unknown): BulkOrderCatalogItem[] {
  const items = Array.isArray(payload) ? payload : []

  return items
    .map(mapBulkOrderMenuItem)
    .filter((item): item is BulkOrderCatalogItem => item != null)
}

export function getBulkOrderKitchensFromItems(items: BulkOrderCatalogItem[]) {
  const kitchens = new Map<string, { id: string; name: string }>()

  for (const item of items) {
    if (!item.kitchenId || kitchens.has(item.kitchenId)) {
      continue
    }

    kitchens.set(item.kitchenId, {
      id: item.kitchenId,
      name: item.kitchenName || "Kitchen",
    })
  }

  return [...kitchens.values()]
}
