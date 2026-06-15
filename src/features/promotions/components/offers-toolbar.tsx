"use client"

import { OfferFilterTabs } from "@/features/promotions/components/offer-filter-tabs"
import type { OfferTab } from "@/features/promotions/types"
import { Input } from "@/components/ui/input"

type OffersToolbarProps = {
  tab: OfferTab
  onTabChange: (value: OfferTab) => void
  search: string
  onSearchChange: (value: string) => void
}

export function OffersToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
}: OffersToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <OfferFilterTabs value={tab} onChange={onTabChange} />
      <div className="w-full max-w-sm lg:w-72">
        <Input
          type="search"
          icon={{ name: "search", position: "left" }}
          placeholder="Search for offer"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  )
}
