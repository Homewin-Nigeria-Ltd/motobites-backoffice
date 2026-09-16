import type { DateRange } from "react-day-picker"

import type {
  SalesDashboardOperationalReportsParams,
  SalesDashboardOperationalReportsPeriod,
} from "@/features/offline-order/types"

function formatApiDateParam(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function buildOperationalReportsParams(
  period: SalesDashboardOperationalReportsPeriod,
  dateRange?: DateRange,
): SalesDashboardOperationalReportsParams {
  const params: SalesDashboardOperationalReportsParams = { period }

  if (period === "custom" && dateRange?.from) {
    params.from = formatApiDateParam(dateRange.from)
    params.to = formatApiDateParam(dateRange.to ?? dateRange.from)
  }

  return params
}
