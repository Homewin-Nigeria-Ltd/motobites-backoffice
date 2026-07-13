export const notificationEndpoints = {
  list: "/api/proxy/admin/notifications",
  read: (id: string) => `/api/proxy/admin/notifications/${id}/read`,
  readAll: "/api/proxy/admin/notifications/read-all",
} as const
