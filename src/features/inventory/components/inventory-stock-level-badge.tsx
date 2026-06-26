import type { InventoryLevelMeta } from "../types"
import { getStockLevelBadgeClass } from "../utils/stock-level"
import { cn } from "@/lib/utils"

type InventoryStockLevelBadgeProps = {
  label: string
  level: InventoryLevelMeta | string
}

export function InventoryStockLevelBadge({
  label,
  level,
}: InventoryStockLevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
        getStockLevelBadgeClass(level)
      )}
    >
      {label}
    </span>
  )
}
