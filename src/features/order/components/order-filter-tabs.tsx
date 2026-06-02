"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { OrderTab } from "@/features/order/types"

const tabLabels: Record<OrderTab, string> = {
  pending: "Pending Orders",
  processing: "Processing Orders",
  transit: "Transit Orders",
  completed: "Completed Orders",
  performance: "Performance",
}

type OrderFilterTabsProps = {
  value: OrderTab
  onChange: (value: OrderTab) => void
  counts: Record<OrderTab, number>
}

export function OrderFilterTabs({
  value,
  onChange,
  counts,
}: OrderFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Order filters"
    >
      {(Object.keys(tabLabels) as OrderTab[]).map((tab) => {
        const isActive = value === tab
        const count = counts[tab]
        const showCount = tab !== "performance" && count > 0

        return (
          <Button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-auto rounded-lg px-4 py-2 text-sm font-medium",
              isActive
                ? "text-primary hover:bg-secondary"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
            onClick={() => onChange(tab)}
          >
            {tabLabels[tab]}
            {showCount ? ` (${count})` : ""}
          </Button>
        )
      })}
    </div>
  )
}
