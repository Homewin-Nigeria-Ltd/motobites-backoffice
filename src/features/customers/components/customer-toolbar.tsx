"use client"

import { CustomerFilterTabs } from "@/features/customers/components/customer-filter-tabs"
import type {
  CustomerFundingCategory,
  CustomerTab,
} from "@/features/customers/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FUNDING_CATEGORY_OPTIONS: {
  value: CustomerFundingCategory
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "funded", label: "Funded" },
  { value: "unfunded", label: "Unfunded" },
]

type CustomerToolbarProps = {
  tab: CustomerTab
  onTabChange: (value: CustomerTab) => void
  search: string
  onSearchChange: (value: string) => void
  category?: CustomerFundingCategory
  onCategoryChange: (value: CustomerFundingCategory) => void
  amount: string
  onAmountChange: (value: string) => void
}

export function CustomerToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  amount,
  onAmountChange,
}: CustomerToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={category ?? ""}
          onValueChange={(value) =>
            onCategoryChange(value as CustomerFundingCategory)
          }
        >
          <SelectTrigger
            size="lg"
            className="w-full border-border bg-background font-normal sm:w-[10rem]"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent align="end">
            {FUNDING_CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Funded amount"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          className="h-10 sm:w-40"
        />
      </div>
    </div>
  )
}
