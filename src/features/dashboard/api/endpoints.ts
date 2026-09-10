const dashboardPath = "/admin/dashboard"

export const dashboardEndpoints = {
  overview: `/api/proxy${dashboardPath}/overview`,
  operationalReports: `/api/proxy${dashboardPath}/operational-reports`,
  cardDetails: (card: string) =>
    `/api/proxy${dashboardPath}/cards/${encodeURIComponent(card)}`,
} as const
