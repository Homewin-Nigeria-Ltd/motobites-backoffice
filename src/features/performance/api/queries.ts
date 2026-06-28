import { queryOptions } from "@tanstack/react-query"

import type { DashboardOverviewParams } from "@/features/dashboard/types"
import { api } from "@/lib/api/client"
import type {
  RevenueAnalyticsData,
  RevenueAnalyticsResponse,
} from "@/features/revenue-analytics/types"

import { performanceAnalyticsEndpoints } from "./endpoints"
import { performanceAnalyticsKeys } from "./keys"

async function fetchPerformanceAnalytics(
  params: DashboardOverviewParams,
): Promise<RevenueAnalyticsData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  const response = await api.get<RevenueAnalyticsResponse>(
    performanceAnalyticsEndpoints.performance,
    query,
  )

  return response.data
}

export const performanceAnalyticsQueries = {
  overview: (params: DashboardOverviewParams) =>
    queryOptions({
      queryKey: performanceAnalyticsKeys.overview(params),
      queryFn: () => fetchPerformanceAnalytics(params),
      placeholderData: (previous) => previous,
    }),
}
