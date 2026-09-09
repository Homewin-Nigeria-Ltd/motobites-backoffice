"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import type { OfflineOrderSavedSort } from "@/features/offline-order/types"

const sortOptions = [
  { label: "Time Saved", value: "time_saved" },
  { label: "Total Amount", value: "total_amount" },
  { label: "Customer", value: "customer" },
] as const satisfies ReadonlyArray<{
  label: string
  value: OfflineOrderSavedSort
}>

type OfflineOrderSavedToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  sort: OfflineOrderSavedSort
  onSortChange: (value: OfflineOrderSavedSort) => void
}

export function OfflineOrderSavedToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: OfflineOrderSavedToolbarProps) {
  const currentSortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "Time Saved"

  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl flex-1">
        <Input
          type="search"
          icon={{ name: "search", position: "left" }}
          placeholder="Search saved orders by ID or customer..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 px-3 text-sm text-muted-foreground"
          >
            Sort by:{" "}
            <span className="ml-1 font-medium text-foreground">
              {currentSortLabel}
            </span>
            <Icons.chevronDown size={16} className="ml-2 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onSortChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
