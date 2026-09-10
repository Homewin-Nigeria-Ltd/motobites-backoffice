"use client"

import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
import type { SalesTransactionHistoryFilters } from "@/features/sales-transaction/types"
import { cn } from "@/lib/utils"

type SalesTransactionHistoryFiltersProps = {
  filters: SalesTransactionHistoryFilters
  dateRange?: DateRange
  onDateRangeChange: (value: DateRange | undefined) => void
  onFiltersChange: (filters: SalesTransactionHistoryFilters) => void
  onSearchChange: (value: string) => void
}

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "walk_in", label: "Walk-in" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "web", label: "Web" },
  { value: "glovo", label: "Glovo" },
  { value: "chowdeck", label: "Chowdeck" },
  { value: "staff_credit", label: "Staff Credit" },
] as const

const METHOD_OPTIONS = [
  { value: "all", label: "All Methods" },
  { value: "cash", label: "Cash" },
  { value: "pos_card", label: "POS Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "staff_credit", label: "Staff Credit" },
  { value: "chowdeck", label: "Chowdeck" },
  { value: "glovo", label: "Glovo" },
] as const

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "successful", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
] as const

function FilterSelect({
  value,
  options,
  onChange,
  className,
}: {
  value: string
  options: ReadonlyArray<{ value: string; label: string }>
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-10 w-full min-w-0 gap-1 border-border bg-background px-2.5 text-xs font-normal",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SalesTransactionHistoryFiltersBar({
  filters,
  dateRange,
  onDateRangeChange,
  onFiltersChange,
  onSearchChange,
}: SalesTransactionHistoryFiltersProps) {
  const updateFilter = <K extends keyof SalesTransactionHistoryFilters>(
    key: K,
    value: SalesTransactionHistoryFilters[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const itemClassName = "min-w-0 w-full"

  return (
    <div className="grid grid-cols-6 items-center gap-2">
      <div className={itemClassName}>
        <DashboardDateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
        />
      </div>

      <FilterSelect
        value={filters.source}
        options={SOURCE_OPTIONS}
        onChange={(value) => updateFilter("source", value)}
        className={itemClassName}
      />

      <FilterSelect
        value={filters.method}
        options={METHOD_OPTIONS}
        onChange={(value) => updateFilter("method", value)}
        className={itemClassName}
      />

      <FilterSelect
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(value) => updateFilter("status", value)}
        className={itemClassName}
      />

      <Input
        type="search"
        icon={{ name: "search", position: "left" }}
        placeholder="Search..."
        value={filters.search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={cn(itemClassName, "h-10 px-2.5 text-xs")}
      />

      <Button
        type="button"
        className={cn(
          itemClassName,
          "h-10 gap-1.5 px-2 text-xs",
        )}
      >
        <Icon name="download" className="size-4" />
        Export
      </Button>
    </div>
  )
}
