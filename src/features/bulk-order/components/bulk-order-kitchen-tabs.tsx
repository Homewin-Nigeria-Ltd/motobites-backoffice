"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ALL_BULK_ORDER_KITCHEN_ID } from "../constants"

type BulkOrderKitchenTabsProps = {
  kitchens: Array<{ id: string; name: string }>
  value: string
  onChange: (value: string) => void
}

export function BulkOrderKitchenTabs({
  kitchens,
  value,
  onChange,
}: BulkOrderKitchenTabsProps) {
  if (kitchens.length === 0) {
    return null
  }

  const tabs = [
    { id: ALL_BULK_ORDER_KITCHEN_ID, name: "All Kitchens" },
    ...kitchens,
  ]

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Kitchens"
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
              "h-auto shrink-0 rounded-full px-4 py-2 text-sm font-medium",
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.name}
          </Button>
        )
      })}
    </div>
  )
}
