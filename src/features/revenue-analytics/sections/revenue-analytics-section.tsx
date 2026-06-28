"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DashboardPeriodFilter } from "@/features/dashboard/components/dashboard-period-filter"
import { DashboardPeriod } from "@/features/dashboard/enums"
import { RevenueCustomerStatisticsChart } from "@/features/revenue-analytics/components/revenue-customer-statistics-chart"
import { RevenueDeliveryLocationsCard } from "@/features/revenue-analytics/components/revenue-delivery-locations-card"
import { RevenuePaymentMethodsChart } from "@/features/revenue-analytics/components/revenue-payment-methods-chart"
import { RevenueSummaryCards } from "@/features/revenue-analytics/components/revenue-summary-cards"
import { RevenueTopKitchensTable } from "@/features/revenue-analytics/components/revenue-top-kitchens-table"
import { RevenueTrendChart } from "@/features/revenue-analytics/components/revenue-trend-chart"
import { useRevenueAnalytics } from "@/features/revenue-analytics/hooks/use-revenue-analytics"
import { AppLoader } from "@/components/ui/app-loader"
import { useFilterToast } from "@/hooks/use-filter-toast"
import { cn } from "@/lib/utils"

export function RevenueAnalyticsSection() {
  const [period, setPeriod] = useState(DashboardPeriod.TwentyFourHours)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const { data, isPending, isFetching, isError, error } = useRevenueAnalytics(
    period,
    dateRange
  )

  useFilterToast({
    isFetching,
    isPending,
    isError,
    error,
    loadingMessage: "Updating revenue analytics...",
    successMessage: "Revenue analytics updated",
    errorMessage: "Failed to load revenue analytics",
  })

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
            : "Failed to load revenue analytics."}
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

      <RevenueSummaryCards kpis={data.kpis} period={data.period} />

      <RevenueTrendChart revenueTrend={data.revenue_trend} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RevenueTopKitchensTable kitchens={data.top_kitchens} />
        </div>
        <RevenuePaymentMethodsChart paymentMethods={data.payment_methods} />
      </div>

      <RevenueCustomerStatisticsChart
        customerStatistics={data.customer_statistics}
      />

      <RevenueDeliveryLocationsCard
        deliveryLocations={data.delivery_locations}
      />
    </div>
  )
}
