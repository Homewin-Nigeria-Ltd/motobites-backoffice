export const offlineOrderEndpoints = {
  create: "/api/proxy/admin/sales-dashboard/offline-orders",
  kitchens: "/api/proxy/admin/sales-dashboard/kitchens",
  menuItems: "/api/proxy/admin/sales-dashboard/menu-items",
  orders: "/api/proxy/admin/sales-dashboard/orders",
  savedOrders: "/api/proxy/admin/sales-dashboard/saved-orders",
  savedOrder: (orderId: string | number) =>
    `/api/proxy/admin/sales-dashboard/saved-orders/${encodeURIComponent(String(orderId))}`,
  order: (orderId: string | number) =>
    `/api/proxy/admin/sales-dashboard/orders/${encodeURIComponent(String(orderId))}`,
  deleteRequest: (orderId: string | number) =>
    `/api/proxy/admin/sales-dashboard/orders/${encodeURIComponent(String(orderId))}/delete-request`,
  deleteRequests: "/api/proxy/admin/sales-dashboard/delete-requests",
  stats: "/api/proxy/admin/sales-dashboard/stats",
  topStaff: "/api/proxy/admin/sales-dashboard/top-staff",
  recentActivity: "/api/proxy/admin/sales-dashboard/recent-activity",
  recentTransactions: "/api/proxy/admin/sales-dashboard/recent-transactions",
  operationalReports: "/api/proxy/admin/sales-dashboard/operational-reports",
} as const
