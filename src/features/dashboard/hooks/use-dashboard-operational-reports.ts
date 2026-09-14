"use client"

import { useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"

import { dashboardQueries } from "../api/queries"
import type { DashboardPeriod } from "../enums"
import { buildDashboardOverviewParams } from "../utils/period"

export function useDashboardOperationalReports(
  period: DashboardPeriod,
  dateRange?: DateRange,
  fulfillmentBranchId?: number | null
) {
  const params = {
    ...buildDashboardOverviewParams(period, dateRange),
    fulfillment_branch_id: fulfillmentBranchId,
  }

  return useQuery(dashboardQueries.operationalReports(params))
}
