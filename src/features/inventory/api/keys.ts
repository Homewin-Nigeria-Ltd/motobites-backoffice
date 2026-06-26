import type { InventoryListParams } from "../types"

export const inventoryKeys = {
  all: ["inventory"] as const,
  overview: () => [...inventoryKeys.all, "overview"] as const,
  items: (params: InventoryListParams = {}) =>
    [...inventoryKeys.all, "items", params] as const,
}
