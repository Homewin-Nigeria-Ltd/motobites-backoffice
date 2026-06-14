"use client"

import type { CustomerTab } from "@/features/customers/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<CustomerTab, string> = {
  all: "All User",
  active: "Active User",
  deactivated: "Deactivated User",
  churn: "Churn User",
}

type CustomerFilterTabsProps = {
  value: CustomerTab
  onChange: (value: CustomerTab) => void
}

export function CustomerFilterTabs({
  value,
  onChange,
}: CustomerFilterTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Customer filters"
    >
      {(Object.keys(tabLabels) as CustomerTab[]).map((tab) => {
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
