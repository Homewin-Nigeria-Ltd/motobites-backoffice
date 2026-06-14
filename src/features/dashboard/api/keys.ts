import type { DashboardOverviewParams } from "../types"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (params: DashboardOverviewParams) =>
    [...dashboardKeys.all, "overview", params] as const,
}
