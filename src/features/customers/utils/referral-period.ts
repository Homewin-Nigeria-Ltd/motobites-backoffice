import { format, startOfMonth, startOfWeek, subHours } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { ReferralPeriod } from "../types"

export const REFERRAL_PERIOD_OPTIONS: Array<{
  value: ReferralPeriod
  label: string
}> = [
  { value: "all", label: "All" },
  { value: "24h", label: "Last 24 hours" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
]

function formatApiDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function buildReferralDateParams(
  period: ReferralPeriod,
  dateRange?: DateRange
): { from?: string; to?: string } {
  const now = new Date()

  if (period === "all") {
    return {}
  }

  if (period === "custom") {
    if (!dateRange?.from) {
      return {}
    }

    return {
      from: formatApiDate(dateRange.from),
      to: formatApiDate(dateRange.to ?? dateRange.from),
    }
  }

  if (period === "24h") {
    return {
      from: formatApiDate(subHours(now, 24)),
      to: formatApiDate(now),
    }
  }

  if (period === "week") {
    return {
      from: formatApiDate(startOfWeek(now, { weekStartsOn: 1 })),
      to: formatApiDate(now),
    }
  }

  return {
    from: formatApiDate(startOfMonth(now)),
    to: formatApiDate(now),
  }
}
