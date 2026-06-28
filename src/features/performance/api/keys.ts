import type { DashboardOverviewParams } from "@/features/dashboard/types"

export const performanceAnalyticsKeys = {
  all: ["performance-analytics"] as const,
  overview: (params: DashboardOverviewParams) =>
    [...performanceAnalyticsKeys.all, params] as const,
}
