import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { DashboardPeriod } from "../enums"
import type { DashboardOverviewParams } from "../types"

export function buildDashboardOverviewParams(
  period: DashboardPeriod,
  dateRange?: DateRange
): DashboardOverviewParams {
  const params: DashboardOverviewParams = { period }

  if (dateRange?.from) {
    params.from = format(dateRange.from, "yyyy-MM-dd")
    params.to = format(dateRange.to ?? dateRange.from, "yyyy-MM-dd")
  }

  return params
}
