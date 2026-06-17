"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getDeliveryTabPath, type DeliveryTab } from "../types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabLabels: Record<DeliveryTab, string> = {
  all: "All",
  unassigned: "Unassigned Orders",
  ongoing: "Ongoing Orders",
  completed: "Completed Orders",
  riders: "Riders",
}

type DeliveryFilterTabsProps = {
  counts?: Partial<Record<DeliveryTab, number>>
}

export function DeliveryFilterTabs({ counts = {} }: DeliveryFilterTabsProps) {
  const pathname = usePathname()

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Delivery filters"
    >
      {(Object.keys(tabLabels) as DeliveryTab[]).map((tab) => {
        const href = getDeliveryTabPath(tab)
        const isActive = pathname === href
        const count = counts[tab]
        const showCount = tab !== "riders" && count !== undefined && count > 0

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
