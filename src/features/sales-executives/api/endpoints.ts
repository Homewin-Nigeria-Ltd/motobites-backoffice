const salesExecutivesPath = "/admin/sales-executives"

export const salesExecutiveEndpoints = {
  list: `/api/proxy${salesExecutivesPath}`,
  application: (id: string | number) =>
    `/api/proxy${salesExecutivesPath}/${id}`,
  review: (id: string | number) =>
    `/api/proxy${salesExecutivesPath}/${id}/review`,
  overview: `/api/proxy${salesExecutivesPath}/overview`,
  agents: `/api/proxy${salesExecutivesPath}/agents`,
  agent: (id: string | number) =>
    `/api/proxy${salesExecutivesPath}/agents/${id}`,
  status: (id: string | number) =>
    `/api/proxy${salesExecutivesPath}/agents/${id}/status`,
  targets: `/api/proxy${salesExecutivesPath}/targets`,
} as const
