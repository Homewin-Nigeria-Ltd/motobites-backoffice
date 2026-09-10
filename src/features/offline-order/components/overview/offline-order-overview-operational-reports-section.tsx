"use client"

import { useState } from "react"

import { OfflineOrderOverviewOperationalReportsCard } from "@/features/offline-order/components/overview/offline-order-overview-operational-reports-card"
import { OverviewOperationalReportsSkeleton } from "@/features/offline-order/components/overview/offline-order-overview-skeletons"
import { useSalesDashboardOperationalReports } from "@/features/offline-order/hooks/use-offline-order-queries"
import type { SalesDashboardOperationalReportsPeriod } from "@/features/offline-order/types"

export function OfflineOrderOverviewOperationalReportsSection() {
  const [period, setPeriod] =
    useState<SalesDashboardOperationalReportsPeriod>("week")

  const { data, isPending, isFetching, isError, error } =
    useSalesDashboardOperationalReports({ period })

  if (isError) {
    throw error
  }

  if (isPending && !data) {
    return <OverviewOperationalReportsSkeleton />
  }

  if (!data) {
    return null
  }

  return (
    <OfflineOrderOverviewOperationalReportsCard
      report={data}
      period={period}
      onPeriodChange={setPeriod}
      isLoading={isFetching}
    />
  )
}
