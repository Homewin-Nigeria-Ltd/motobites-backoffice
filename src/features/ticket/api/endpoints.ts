const ticketsPath = "/admin/tickets"

export const ticketServerEndpoints = {
  overview: `${ticketsPath}/overview`,
  tickets: ticketsPath,
  ticket: (id: string) => `${ticketsPath}/${id}`,
  updateStatus: (id: string) => `${ticketsPath}/${id}/status`,
  assignResolver: (id: string) => `${ticketsPath}/${id}/assign-resolver`,
} as const

export const ticketEndpoints = {
  overview: `/api/proxy${ticketsPath}/overview`,
  tickets: `/api/proxy${ticketsPath}`,
  ticket: (id: string) => `/api/proxy${ticketsPath}/${id}`,
  updateStatus: (id: string) => `/api/proxy${ticketsPath}/${id}/status`,
  assignResolver: (id: string) => `/api/proxy${ticketsPath}/${id}/assign-resolver`,
} as const
