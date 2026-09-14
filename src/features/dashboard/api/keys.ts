import type { DashboardOverviewParams } from "../types"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "overview", params] as const,
  operationalReports: (params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "operational-reports", params] as const,
  riderAnalytics: (params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "rider-analytics", params] as const,
  bnplAnalytics: (params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "bnpl-analytics", params] as const,
  cardDetails: (card: string, params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "card", card, params] as const,
}
