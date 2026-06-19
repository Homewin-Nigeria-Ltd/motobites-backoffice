"use client"

import {
  INTEGRATION_CATEGORY_LABELS,
  type IntegrationCategory,
} from "@/features/settings/integration.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories: IntegrationCategory[] = ["payment", "map", "recovery"]

type IntegrationCategoryTabsProps = {
  value: IntegrationCategory
  onChange: (category: IntegrationCategory) => void
}

export function IntegrationCategoryTabs({
  value,
  onChange,
}: IntegrationCategoryTabsProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Integration categories"
    >
      {categories.map((category) => {
        const isActive = value === category

        return (
          <Button
            key={category}
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
            onClick={() => onChange(category)}
          >
            {INTEGRATION_CATEGORY_LABELS[category]}
          </Button>
        )
      })}
    </div>
  )
}
