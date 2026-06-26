import type { InventoryLevelMeta, InventoryStockLevel } from "../types"

export const STOCK_LEVEL_CHART_COLORS = {
  high: "var(--primary)",
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
  const value =
    typeof level === "string"
      ? level
      : level.value

  switch (value) {
    case "high":
      return "bg-[#FFF1E0] text-primary"
    case "medium":
      return "bg-[#E8F7EA] text-[#2F8A3E] dark:bg-emerald-950/40 dark:text-emerald-400"
    case "low":
      return "bg-[#FEECEC] text-[#E71D36] dark:bg-red-950/40 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}
