const ticketsPath = "/admin/tickets"
const overviewPath = `${ticketsPath}/overview`

export const ticketServerEndpoints = {
  overviewSummary: `${overviewPath}/summary`,
  overviewResolutionRate: `${overviewPath}/resolution-rate`,
  overviewByIssue: `${overviewPath}/by-issue`,
  overviewByStatus: `${overviewPath}/by-status`,
  overviewUrgentAlert: `${overviewPath}/urgent-alert`,
  tickets: ticketsPath,
  ticket: (id: string) => `${ticketsPath}/${id}`,
  updateStatus: (id: string) => `${ticketsPath}/${id}/status`,
  assignResolver: (id: string) => `${ticketsPath}/${id}/assign-resolver`,
} as const

export const ticketEndpoints = {
  overviewSummary: `/api/proxy${overviewPath}/summary`,
  overviewResolutionRate: `/api/proxy${overviewPath}/resolution-rate`,
  overviewByIssue: `/api/proxy${overviewPath}/by-issue`,
  overviewByStatus: `/api/proxy${overviewPath}/by-status`,
  overviewUrgentAlert: `/api/proxy${overviewPath}/urgent-alert`,
  tickets: `/api/proxy${ticketsPath}`,
  ticket: (id: string) => `/api/proxy${ticketsPath}/${id}`,
  updateStatus: (id: string) => `/api/proxy${ticketsPath}/${id}/status`,
  assignResolver: (id: string) => `/api/proxy${ticketsPath}/${id}/assign-resolver`,
} as const
