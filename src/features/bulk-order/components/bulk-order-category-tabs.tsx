"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { BulkOrderCategory } from "../types"

type BulkOrderCategoryTabsProps = {
  categories: BulkOrderCategory[]
  value: string
  onChange: (value: string) => void
}

export function BulkOrderCategoryTabs({
  categories,
  value,
  onChange,
}: BulkOrderCategoryTabsProps) {
  if (categories.length <= 1) {
    return null
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Bulk order categories"
    >
      {categories.map((category) => {
        const isActive = value === category.id

        return (
          <Button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant="outline"
            className={cn(
              "h-auto rounded-full px-4 py-2 text-sm font-medium",
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:bg-transparent hover:text-foreground",
            )}
            onClick={() => onChange(category.id)}
          >
            {category.label}
          </Button>
        )
      })}
    </div>
  )
}
