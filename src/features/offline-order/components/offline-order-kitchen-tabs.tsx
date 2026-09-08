"use client"

import type { ApiSalesDashboardKitchen } from "@/features/offline-order/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const ALL_KITCHENS_TAB_VALUE = "all"

type OfflineOrderKitchenTabsProps = {
  kitchens: ApiSalesDashboardKitchen[]
  value: string
  onChange: (value: string) => void
}

export function OfflineOrderKitchenTabs({
  kitchens,
  value,
  onChange,
}: OfflineOrderKitchenTabsProps) {
  if (kitchens.length === 0) {
    return null
  }

  const tabs = [
    { id: ALL_KITCHENS_TAB_VALUE, label: "All" },
    ...kitchens.map((kitchen) => ({
      id: String(kitchen.id),
      label: kitchen.name,
    })),
  ]

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Kitchen filters"
    >
      {tabs.map((tab) => {
        const isActive = value === tab.id

        return (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant="outline"
            className={cn(
              "h-auto rounded-lg px-4 py-2 text-sm font-medium",
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}
