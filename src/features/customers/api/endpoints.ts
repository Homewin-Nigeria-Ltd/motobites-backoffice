const customerManagementPath = "/admin/customer-management"

export const customerEndpoints = {
  list: `/api/proxy${customerManagementPath}`,
  overview: `/api/proxy${customerManagementPath}/overview`,
  detail: (id: string | number) => `/api/proxy${customerManagementPath}/${id}`,
  member: (id: string | number) => `${customerManagementPath}/${id}`,
  suspend: (id: string | number) => `${customerManagementPath}/${id}/suspend`,
  deactivate: (id: string | number) => `${customerManagementPath}/${id}/deactivate`,
} as const
