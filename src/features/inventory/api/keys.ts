import type { InventoryListParams } from "../types"

export const inventoryKeys = {
  all: ["inventory"] as const,
  overview: (branchId?: number | null) =>
    [...inventoryKeys.all, "overview", branchId] as const,
  items: (params: InventoryListParams = {}) =>
    [...inventoryKeys.all, "items", params] as const,
}
