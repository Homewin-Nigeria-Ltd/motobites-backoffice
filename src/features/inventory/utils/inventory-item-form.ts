import type { InventoryItemFormValues } from "../schemas/inventory-item-form.schema"
import type { ApiInventoryItem } from "../types"

export type { InventoryItemFormValues }

export function mapApiInventoryItemToFormValues(
  item: ApiInventoryItem
): InventoryItemFormValues {
  const stockLevel = item.stock_level

  return {
    name: item.name,
    description: item.description ?? "",
    amount: item.amount,
    quantity: item.quantity,
    category: item.category,
    stock_level:
      stockLevel === "high" ||
      stockLevel === "medium" ||
      stockLevel === "low"
        ? stockLevel
        : "high",
  }
}

export function getInventoryItemExistingImageUrl(item?: ApiInventoryItem | null) {
  return item?.image_url ?? null
}
