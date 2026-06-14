"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getOrderTabPath, type OrderTab } from "@/features/order/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<OrderTab, string> = {
  pending: "Pending Orders",
  processing: "Processing Orders",
  transit: "Transit Orders",
  completed: "Completed Orders",
  performance: "Performance",
}

type OrderFilterTabsProps = {
  counts: Record<OrderTab, number>
}

export function OrderFilterTabs({ counts }: OrderFilterTabsProps) {
  const pathname = usePathname()

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Order filters"
    >
      {(Object.keys(tabLabels) as OrderTab[]).map((tab) => {
        const href = getOrderTabPath(tab)
        const isActive = pathname === href
        const count = counts[tab]
        const showCount = tab !== "performance" && count > 0

        return (
          <Button
            key={tab}
            asChild
            role="tab"
            aria-selected={isActive}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "h-auto rounded-lg px-4 py-2 text-sm font-medium",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:bg-transparent hover:text-foreground"
            )}
          >
            <Link href={href}>
              {tabLabels[tab]}
              {showCount ? ` (${count})` : ""}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
