"use client"

import { useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"

import { dashboardQueries } from "../api/queries"
import type { DashboardPeriod } from "../enums"
import { buildDashboardOverviewParams } from "../utils/period"

export function useDashboardOverview(
  period: DashboardPeriod,
  dateRange?: DateRange
) {
  const params = buildDashboardOverviewParams(period, dateRange)

  return useQuery(dashboardQueries.overview(params))
}
