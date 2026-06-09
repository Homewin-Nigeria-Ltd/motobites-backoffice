const staffManagementPath = "/admin/user-management"

export const staffEndpoints = {
  list: `/api/proxy${staffManagementPath}`,
  roles: `/api/proxy${staffManagementPath}/roles`,
  invite: `${staffManagementPath}/invite`,
  member: (id: string | number) => `${staffManagementPath}/${id}`,
  favorite: (id: string | number) => `${staffManagementPath}/${id}/favorite`,
  export: `/api/proxy${staffManagementPath}/export`,
} as const
