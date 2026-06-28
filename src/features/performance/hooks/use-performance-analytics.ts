"use client"

import { useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"

import type { DashboardPeriod } from "@/features/dashboard/enums"
import { buildDashboardOverviewParams } from "@/features/dashboard/utils/period"
import { performanceAnalyticsQueries } from "@/features/performance/api/queries"
import { withPerformanceDefaults } from "@/features/performance/utils/with-performance-defaults"

export function usePerformanceAnalytics(
  period: DashboardPeriod,
  dateRange?: DateRange,
) {
  const params = buildDashboardOverviewParams(period, dateRange)
  const query = useQuery(performanceAnalyticsQueries.overview(params))

  return {
    ...query,
    data: query.data ? withPerformanceDefaults(query.data) : undefined,
  }
}
