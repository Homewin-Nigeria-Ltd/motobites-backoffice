import type {
  ApiSalesDashboardOrder,
  OfflineOrderCartItem,
  OfflineOrderCheckoutDraft,
} from "@/features/offline-order/types"
import {
  mapSalesDashboardOrderItemsToCart,
  mapSalesDashboardOrderToCheckout,
} from "@/features/offline-order/utils/sales-dashboard-order"

import type { BulkOrderCartItem, BulkOrderSource } from "../types"
import { getBulkOrderItemKind } from "./catalog"
import {
  resolveBulkOrderAllocationRole,
  toBulkOrderLineType,
} from "./map-items"

export function toOfflineOrderCartItems(
  items: BulkOrderCartItem[],
): OfflineOrderCartItem[] {
  return items.map((item) => ({
    lineId: item.itemId,
    itemId: item.itemId,
    name: item.name,
    basePrice: item.basePrice,
    price: item.price,
    image: item.image,
    kitchenId: item.kitchenId,
    kitchenName: item.kitchenName,
    quantity: item.quantity,
    addons: item.addons,
  }))
}

export function mapBulkOrderItemsToCart(
  order: ApiSalesDashboardOrder,
): BulkOrderCartItem[] {
  return mapSalesDashboardOrderItemsToCart(order).map((item) => {
    const categoryName =
      (item as OfflineOrderCartItem & { categoryName?: string }).categoryName ??
      ""
    const sourceItem = (order.items ?? []).find(
      (entry) => String(entry.menu_item_id ?? entry.id) === item.itemId,
    )
    const sourceType =
      sourceItem && typeof sourceItem === "object" && "type" in sourceItem
        ? String((sourceItem as { type?: string }).type ?? "")
        : ""
    const sourceRole =
      sourceItem && typeof sourceItem === "object" && "allocation_role" in sourceItem
        ? String((sourceItem as { allocation_role?: string }).allocation_role ?? "")
        : sourceType
    const allocationRole = resolveBulkOrderAllocationRole(
      {
        allocation_role: sourceRole,
        type: sourceType,
        categoryName,
      },
      categoryName,
    )
    const lineType = toBulkOrderLineType(allocationRole)
    const menuItemId = Number(item.itemId)

    return {
      itemId: item.itemId,
      menuItemId: Number.isFinite(menuItemId) ? menuItemId : 0,
      name: item.name,
      basePrice: item.basePrice,
      price: item.price,
      image: item.image,
      kitchenId: item.kitchenId,
      kitchenName: item.kitchenName,
      categoryId: categoryName || item.kitchenId,
      categoryName,
      quantity: item.quantity,
      kind: getBulkOrderItemKind(categoryName || lineType),
      lineType,
      allocationRole,
      addons: (item.addons ?? []).map((addon) => ({
        id: addon.id,
        menuItemId: addon.id,
        name: addon.name,
        price: addon.price,
        groupName: addon.groupName,
      })),
    }
  })
}

export function mapBulkOrderToCheckout(order: ApiSalesDashboardOrder) {
  return mapSalesDashboardOrderToCheckout(order)
}

export function resolveBulkOrderSource(
  _order?: ApiSalesDashboardOrder | { order_source?: string | null; source?: string | null },
): BulkOrderSource {
  return "corporate_bulk"
}

export function mapBulkOrderCheckoutSource(
  checkout: OfflineOrderCheckoutDraft,
): BulkOrderSource {
  return resolveBulkOrderSource({
    order_source: checkout.orderSource,
  })
}
