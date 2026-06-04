export const orderEndpoints = {
  grouped: "/api/proxy/admin/order-management/orders/grouped",
  tabCounts: "/api/proxy/admin/order-management/tab-counts",
  detail: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}`,
  updateStatus: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/status`,
  assignees: "/api/proxy/admin/order-management/assignees",
  assignChef: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/assign-chef`,
  assignRider: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/assign-rider`,
  assignSupport: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/assign-support`,
  extendPrepTime: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/extend-prep-time`,
  receipt: (orderId: string) =>
    `/api/proxy/admin/order-management/orders/${orderId}/receipt`,
} as const
