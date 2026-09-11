"use client"

import type { DateRange } from "react-day-picker"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
import type { SalesTransactionAnalyticsPeriod } from "@/features/sales-transaction/types"

const PERIOD_OPTIONS: Array<{
  value: SalesTransactionAnalyticsPeriod
  label: string
}> = [
  { value: "24h", label: "Last 24 hours" },
  { value: "week", label: "This Week" },
  { value: "3months", label: "Last 3 months" },
  { value: "year", label: "This Year" },
]

type SalesTransactionAnalyticsToolbarProps = {
  period: SalesTransactionAnalyticsPeriod
  dateRange?: DateRange
  onPeriodChange: (period: SalesTransactionAnalyticsPeriod) => void
  onDateRangeChange: (dateRange: DateRange | undefined) => void
  isLoading?: boolean
}

export function SalesTransactionAnalyticsToolbar({
  period,
  dateRange,
  onPeriodChange,
  onDateRangeChange,
  isLoading = false,
}: SalesTransactionAnalyticsToolbarProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <DashboardDateRangePicker
        value={dateRange}
        onChange={onDateRangeChange}
      />

      <div className="ml-auto shrink-0">
        <Select
          value={period}
          onValueChange={(value) =>
            onPeriodChange(value as SalesTransactionAnalyticsPeriod)
          }
          disabled={isLoading}
        >
          <SelectTrigger className="h-10 w-[11.5rem] border-border bg-background">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent align="end">
            {PERIOD_OPTIONS.map((option) => (
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
