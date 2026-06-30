import type { InventoryLevelMeta, InventoryStockLevel } from "../types"

export const STOCK_LEVEL_CHART_COLORS = {
  high: "#f97316",
  medium: "#D5F5E3",
  low: "#E71D36",
} as const

export function getStockLevelChartColor(level: InventoryStockLevel | string) {
  if (level in STOCK_LEVEL_CHART_COLORS) {
    return STOCK_LEVEL_CHART_COLORS[level as InventoryStockLevel]
  }

  return "var(--muted-foreground)"
}

export function getStockLevelBadgeClass(level: InventoryLevelMeta | InventoryStockLevel | string) {
  const value = typeof level === "string" ? level : level.value

  switch (value) {
    case "high":
      return "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
    case "medium":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
    case "low":
      return "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}
