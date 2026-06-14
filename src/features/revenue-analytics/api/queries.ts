import { queryOptions } from "@tanstack/react-query"

import { dashboardEndpoints } from "@/features/dashboard/api/endpoints"
import type { DashboardOverviewParams } from "@/features/dashboard/types"
import { api } from "@/lib/api/client"

import type { RevenueAnalyticsData, RevenueAnalyticsResponse } from "../types"
import { revenueAnalyticsKeys } from "./keys"

async function fetchRevenueAnalytics(
  params: DashboardOverviewParams
): Promise<RevenueAnalyticsData> {
  const query: Record<string, string> = { period: params.period }

  if (params.from) {
    query.from = params.from
  }

  if (params.to) {
    query.to = params.to
  }

  const response = await api.get<RevenueAnalyticsResponse>(
    dashboardEndpoints.overview,
    query
  )

  return response.data.analytics
}

export const revenueAnalyticsQueries = {
  overview: (params: DashboardOverviewParams) =>
    queryOptions({
      queryKey: revenueAnalyticsKeys.overview(params),
      queryFn: () => fetchRevenueAnalytics(params),
      placeholderData: (previous) => previous,
    }),
}
