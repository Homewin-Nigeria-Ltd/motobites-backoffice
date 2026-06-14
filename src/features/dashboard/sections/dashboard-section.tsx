"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DashboardDailyTrafficCard } from "@/features/dashboard/components/dashboard-daily-traffic-card"
import { DashboardInventoryStatusCard } from "@/features/dashboard/components/dashboard-inventory-status-card"
import { DashboardOrderFrequencyCard } from "@/features/dashboard/components/dashboard-order-frequency-card"
import { DashboardTopMotopilotCard } from "@/features/dashboard/components/dashboard-top-motopilot-card"
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards"
import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import { DashboardSalesRevenueChart } from "@/features/dashboard/components/dashboard-sales-revenue-chart"
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards"
import { DashboardTopSellingList } from "@/features/dashboard/components/dashboard-top-selling-list"
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview"
import { DashboardPeriod } from "@/features/dashboard/enums"
import { AppLoader } from "@/components/ui/app-loader"
import { cn } from "@/lib/utils"

export function DashboardSection() {
  const [period, setPeriod] = useState(DashboardPeriod.TwentyFourHours)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { data, isPending, isError, error } = useDashboardOverview(
    period,
    dateRange
  )

  const handlePeriodChange = (next: DashboardPeriod) => {
    setPeriod(next)
    setDateRange(undefined)
  }

  const handleDateRangeChange = (next: DateRange | undefined) => {
    setDateRange(next)
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <DashboardPeriodFilter
          value={period}
          onChange={handlePeriodChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load dashboard overview."}
        </div>
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        <DashboardPeriodFilter
          value={period}
          onChange={handlePeriodChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
        <AppLoader className="flex-1 py-24" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6"
      )}
    >
      <DashboardPeriodFilter
        value={period}
        onChange={handlePeriodChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <DashboardSummaryCards kpis={data.kpis} />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardOrderFrequencyCard orderFrequency={data.order_frequency} />
        </div>
        <DashboardTopMotopilotCard topMotopilots={data.top_motopilots} />
      </div>

      <DashboardSalesRevenueChart salesRevenue={data.sales_revenue} />

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardDailyTrafficCard dailyTraffic={data.daily_traffic} />
        <DashboardInventoryStatusCard inventoryStatus={data.inventory_status} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardTopSellingList
          title="Top Selling Combos"
          items={data.top_selling.combos}
        />
        <DashboardTopSellingList
          title="Top Selling Items"
          items={data.top_selling.items}
        />
        <DashboardTopSellingList
          title="Top Selling Kitchen"
          items={data.top_selling.kitchens}
        />
      </div>

      <DashboardKpiCards metrics={data.performance_metrics} />
    </div>
  )
}
