const dashboardPath = "/admin/dashboard"

export const dashboardEndpoints = {
  overview: `/api/proxy${dashboardPath}/overview`,
  operationalReports: `/api/proxy${dashboardPath}/operational-reports`,
} as const
