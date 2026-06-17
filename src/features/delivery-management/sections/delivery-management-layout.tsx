"use client"

import { DeliveryFilterTabs } from "../components/delivery-filter-tabs"
import type { DeliveryTab } from "../types"
import { Input } from "@/components/ui/input"

type DeliveryManagementLayoutProps = {
  children: React.ReactNode
  counts?: Partial<Record<DeliveryTab, number>>
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export function DeliveryManagementLayout({
  children,
  counts,
  search,
  onSearchChange,
  searchPlaceholder = "Search order using order number",
}: DeliveryManagementLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <DeliveryFilterTabs counts={counts} />
          <div className="w-full max-w-xs shrink-0 sm:w-64">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder={searchPlaceholder}
              className="h-10"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
