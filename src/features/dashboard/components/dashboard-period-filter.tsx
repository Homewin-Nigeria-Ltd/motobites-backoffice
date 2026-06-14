"use client"

import type { DateRange } from "react-day-picker"

import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
import {
  DASHBOARD_PERIOD_OPTIONS,
  DashboardPeriod,
} from "@/features/dashboard/enums"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DashboardPeriodFilterProps = {
  value: DashboardPeriod
  onChange: (value: DashboardPeriod) => void
  dateRange?: DateRange
  onDateRangeChange: (value: DateRange | undefined) => void
}

export function DashboardPeriodFilter({
  value,
  onChange,
  dateRange,
  onDateRangeChange,
}: DashboardPeriodFilterProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 [-webkit-overflow-scrolling:touch] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {DASHBOARD_PERIOD_OPTIONS.map((option) => {
          const isActive = value === option.value

          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? "secondary" : "ghost"}
              size="lg"
              className={cn(
                "shrink-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-transparent hover:text-foreground"
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>

      <div className="shrink-0 self-end md:self-auto">
        <DashboardDateRangePicker
          value={dateRange}
          onChange={onDateRangeChange}
        />
      </div>
    </div>
  )
}
