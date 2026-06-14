"use client"

import { useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"

import type { DashboardPeriod } from "@/features/dashboard/enums"
import { buildDashboardOverviewParams } from "@/features/dashboard/utils/period"

import { revenueAnalyticsQueries } from "../api/queries"

export function useRevenueAnalytics(
  period: DashboardPeriod,
  dateRange?: DateRange
) {
  const params = buildDashboardOverviewParams(period, dateRange)

  return useQuery(revenueAnalyticsQueries.overview(params))
}
