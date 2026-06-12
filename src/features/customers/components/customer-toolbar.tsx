"use client"

import { CustomerFilterTabs } from "@/features/customers/components/customer-filter-tabs"
import type { CustomerTab } from "@/features/customers/types"
import { Input } from "@/components/ui/input"

type CustomerToolbarProps = {
  tab: CustomerTab
  onTabChange: (value: CustomerTab) => void
  search: string
  onSearchChange: (value: string) => void
}

export function CustomerToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
}: CustomerToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <CustomerFilterTabs value={tab} onChange={onTabChange} />
      <div className="w-full max-w-sm lg:w-72">
        <Input
          type="search"
          icon={{ name: "search", position: "left" }}
          placeholder="Search for users"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  )
}
