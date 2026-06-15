"use client"

import type { OfferTab } from "@/features/promotions/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<OfferTab, string> = {
  all: "All offers",
  active: "Active offers",
  inactive: "Inactive offer",
  expired: "Expired offers",
}

type OfferFilterTabsProps = {
  value: OfferTab
  onChange: (value: OfferTab) => void
}

export function OfferFilterTabs({ value, onChange }: OfferFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Offer filters"
    >
      {(Object.keys(tabLabels) as OfferTab[]).map((tab) => {
        const isActive = value === tab

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
                ? "text-primary"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
            onClick={() => onChange(tab)}
          >
            {tabLabels[tab]}
          </Button>
        )
      })}
    </div>
  )
}
