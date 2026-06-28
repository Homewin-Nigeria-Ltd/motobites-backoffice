import type { InventoryCategory, InventoryStockLevel } from "./types"

export const inventoryCategories = [
  { value: "food_stuff" as InventoryCategory, label: "Food stuff" },
  { value: "utensils" as InventoryCategory, label: "Utensils" },
  { value: "accessories" as InventoryCategory, label: "Accessories" },
] as const

export const inventoryStockLevels = [
  { value: "high" as InventoryStockLevel, label: "High Stock" },
  { value: "medium" as InventoryStockLevel, label: "Medium Stock" },
  { value: "low" as InventoryStockLevel, label: "Low Stock" },
] as const

export const inventoryListStockFilters = [
  { value: "", label: "All levels" },
  ...inventoryStockLevels.map(({ value, label }) => ({ value, label })),
] as const

export const inventoryListCategoryFilters = [
  { value: "", label: "All categories" },
  ...inventoryCategories.map(({ value, label }) => ({ value, label })),
] as const

export const INVENTORY_TABLE_PAGE_SIZE = 20
