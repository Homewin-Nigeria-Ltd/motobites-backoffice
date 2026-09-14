"use client"

import { useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

import { OfflineOrderOverviewOperationalReportsCard } from "@/features/offline-order/components/overview/offline-order-overview-operational-reports-card"
import { useSalesDashboardOperationalReports } from "@/features/offline-order/hooks/use-offline-order-queries"
import type { SalesDashboardOperationalReportsPeriod } from "@/features/offline-order/types"
import { buildOperationalReportsParams } from "@/features/offline-order/utils/operational-reports-params"

export function OfflineOrderOverviewOperationalReportsSection() {
  const [period, setPeriod] =
    useState<SalesDashboardOperationalReportsPeriod>("today")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const queryParams = useMemo(
    () => buildOperationalReportsParams(period, dateRange),
    [period, dateRange],
  )

  const isCustomPeriodReady =
    period !== "custom" || Boolean(dateRange?.from)

  const { data, isPending, isFetching, isError, error } =
    useSalesDashboardOperationalReports(queryParams, {
      enabled: isCustomPeriodReady,
    })

  const handlePeriodChange = (
    nextPeriod: SalesDashboardOperationalReportsPeriod,
  ) => {
    setPeriod(nextPeriod)

    if (nextPeriod !== "custom") {
      setDateRange(undefined)
    }
  }

  if (isError) {
    throw error
  }

  const isLoading =
    !isCustomPeriodReady || isPending || (isFetching && !data)

  return (
    <OfflineOrderOverviewOperationalReportsCard
      report={data}
      period={period}
      dateRange={dateRange}
      onPeriodChange={handlePeriodChange}
      onDateRangeChange={setDateRange}
      isLoading={isLoading}
    />
  )
}
