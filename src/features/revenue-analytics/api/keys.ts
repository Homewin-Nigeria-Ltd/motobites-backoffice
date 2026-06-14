import type { DashboardOverviewParams } from "@/features/dashboard/types"

export const revenueAnalyticsKeys = {
  all: ["revenue-analytics"] as const,
  overview: (params: DashboardOverviewParams) =>
    [...revenueAnalyticsKeys.all, params] as const,
}
