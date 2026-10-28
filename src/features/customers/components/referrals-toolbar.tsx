"use client"

import type { DateRange } from "react-day-picker"

import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
import type { ReferralCategory, ReferralPeriod } from "@/features/customers/types"
import { REFERRAL_PERIOD_OPTIONS } from "@/features/customers/utils/referral-period"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const REFERRAL_CATEGORY_OPTIONS: {
  value: ReferralCategory | "all"
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "funded", label: "Funded" },
  { value: "unfunded", label: "Unfunded" },
]

type ReferralsToolbarProps = {
  total: number
  period?: ReferralPeriod
  category?: ReferralCategory | "all"
  dateRange?: DateRange
  onPeriodChange: (period: ReferralPeriod) => void
  onCategoryChange: (category: ReferralCategory | "all") => void
  onDateRangeChange: (value: DateRange | undefined) => void
}

export function ReferralsToolbar({
  total,
  period,
  category,
  dateRange,
  onPeriodChange,
  onCategoryChange,
  onDateRangeChange,
}: ReferralsToolbarProps) {
  const showCustomDatePicker = period === "custom"

  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">Referrals</h2>
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-primary">
          {total.toLocaleString()}
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        {showCustomDatePicker ? (
          <DashboardDateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Date"
            className="h-10 truncate px-2.5 text-xs"
          />
        ) : null}
        <Select
          value={category ?? ""}
          onValueChange={(value) =>
            onCategoryChange(value as ReferralCategory | "all")
          }
        >
          <SelectTrigger
            size="lg"
            className="w-full border-border bg-background font-normal sm:w-[10rem]"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent align="end">
            {REFERRAL_CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={period ?? ""}
          onValueChange={(value) => onPeriodChange(value as ReferralPeriod)}
        >
          <SelectTrigger
            size="lg"
            className="w-full border-border bg-background font-normal sm:w-[12.5rem]"
          >
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent align="end">
            {REFERRAL_PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
