"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { SalesTransactionAnalyticsStats } from "@/features/sales-transaction/components/sales-transaction-analytics-stats"
import { SalesTransactionAnalyticsToolbar } from "@/features/sales-transaction/components/sales-transaction-analytics-toolbar"
import {
  SalesTransactionRevenueBreakdown,
  SalesTransactionTopItemsTable,
} from "@/features/sales-transaction/components/sales-transaction-revenue-breakdown"
import { SalesTransactionRevenueTrendChart } from "@/features/sales-transaction/components/sales-transaction-revenue-trend-chart"
import { useSalesTransactionAnalytics } from "@/features/sales-transaction/hooks/use-sales-transaction-queries"
import type { SalesTransactionAnalyticsPeriod } from "@/features/sales-transaction/types"
import { buildTransactionAnalyticsParams } from "@/features/sales-transaction/utils/date-range"
import { emptySalesTransactionAnalyticsViewModel } from "@/features/sales-transaction/utils/map-transaction-analytics"

export function SalesTransactionAnalyticsSection() {
  const [period, setPeriod] = useState<SalesTransactionAnalyticsPeriod>("year")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const analyticsParams = useMemo(
    () => buildTransactionAnalyticsParams(period, dateRange),
    [period, dateRange],
  )

  const { data, isPending, isFetching, isError, error } =
    useSalesTransactionAnalytics(analyticsParams)

  const viewModel = data ?? emptySalesTransactionAnalyticsViewModel()
  const isLoading = isPending || (isFetching && !data)

  const handlePeriodChange = (nextPeriod: SalesTransactionAnalyticsPeriod) => {
    setPeriod(nextPeriod)
    setDateRange(undefined)
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderBackButton
        href="/offline-order/sales-transaction"
        label="Back to Sales Transaction"
      />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        <SalesTransactionAnalyticsToolbar
          period={period}
          dateRange={dateRange}
          onPeriodChange={handlePeriodChange}
          onDateRangeChange={setDateRange}
          isLoading={isLoading}
        />

        <SalesTransactionAnalyticsStats
          summary={viewModel.summary}
          isLoading={isLoading}
        />

        <SalesTransactionRevenueTrendChart
          data={viewModel.revenueTrend}
          periodLabel={viewModel.periodLabel}
          isLoading={isLoading}
        />

        <SalesTransactionRevenueBreakdown
          sources={viewModel.sourceBreakdown}
          paymentMethods={viewModel.paymentBreakdown}
          totalRevenue={viewModel.summary.totalRevenue}
          isLoading={isLoading}
        />

        <SalesTransactionTopItemsTable
          items={viewModel.topItems}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
