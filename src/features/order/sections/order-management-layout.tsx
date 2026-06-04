"use client"

import { OrderFilterTabs } from "@/features/order/components/order-filter-tabs"
import {
  useOrderSearchInput,
  useOrderTabCounts,
} from "@/features/order/hooks/use-order-queries"
import { Input } from "@/components/ui/input"

type OrderManagementLayoutProps = {
  children: React.ReactNode
}

export function OrderManagementLayout({ children }: OrderManagementLayoutProps) {
  const { counts } = useOrderTabCounts()
  const { value: search, setValue: setSearch } = useOrderSearchInput()

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <OrderFilterTabs counts={counts} />
          <div className="w-full max-w-xs shrink-0 sm:w-64">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search order using order number"
              className="h-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
