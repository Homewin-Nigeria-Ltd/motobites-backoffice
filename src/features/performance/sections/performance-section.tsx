"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import { DashboardPeriod } from "@/features/dashboard/enums"
import { PerformanceCustomerGrowthChart } from "@/features/performance/components/performance-customer-growth-chart"
import { PerformanceDeviceSalesChart } from "@/features/performance/components/performance-device-sales-chart"
import { PerformanceMostSoldItemCard } from "@/features/performance/components/performance-most-sold-item-card"
import { PerformanceOrganicTrafficChart } from "@/features/performance/components/performance-organic-traffic-chart"
import { PerformanceSalesGeneratedChart } from "@/features/performance/components/performance-sales-generated-chart"
import { PerformanceSalesReportChart } from "@/features/performance/components/performance-sales-report-chart"
import { PerformanceSparklineMetrics } from "@/features/performance/components/performance-sparkline-metrics"
import { PerformanceTopRiderChart } from "@/features/performance/components/performance-top-rider-chart"
import { PerformanceTopSellingRestaurantsChart } from "@/features/performance/components/performance-top-selling-restaurants-chart"
import { usePerformanceAnalytics } from "@/features/performance/hooks/use-performance-analytics"
import { AppLoader } from "@/components/ui/app-loader"
import { useFilterToast } from "@/hooks/use-filter-toast"

export function PerformanceSection() {
  const [period, setPeriod] = useState(DashboardPeriod.TwentyFourHours)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { data, isPending, isFetching, isError, error } =
    usePerformanceAnalytics(period, dateRange)

  useFilterToast({
    isFetching,
    isPending,
    isError,
    error,
    loadingMessage: "Updating performance data...",
    successMessage: "Performance data updated",
    errorMessage: "Failed to load performance data",
  })

  const handlePeriodChange = (next: DashboardPeriod) => {
    setPeriod(next)
    setDateRange(undefined)
  }

  const filter = (
    <DashboardPeriodFilter
      value={period}
      onChange={handlePeriodChange}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    />
  )

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        {filter}
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load performance analytics."}
        </div>
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
        {filter}
        <AppLoader className="flex-1 py-24" />
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {filter}

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <PerformanceOrganicTrafficChart organicTraffic={data.organic_traffic} />
        <PerformanceSalesGeneratedChart salesGenerated={data.sales_generated} />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <PerformanceTopSellingRestaurantsChart
          restaurants={data.top_selling_restaurants}
        />
        <PerformanceSparklineMetrics metrics={data.sparkline_metrics} />
        <PerformanceMostSoldItemCard item={data.most_sold_item} />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <PerformanceSalesReportChart salesByLocation={data.sales_by_location} />
        <PerformanceDeviceSalesChart deviceSales={data.device_sales} />
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <PerformanceTopRiderChart
          topRiderPerformance={data.top_rider_performance}
        />
        <PerformanceCustomerGrowthChart
          customerGrowth={data.customer_growth_by_area}
        />
      </div>
    </div>
  )
}
