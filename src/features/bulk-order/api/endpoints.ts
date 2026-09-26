export const bulkOrderEndpoints = {
  items: "/api/proxy/admin/sales-dashboard/bulk-orders/items",
  preview: "/api/proxy/admin/sales-dashboard/bulk-orders/preview",
  orders: "/api/proxy/admin/sales-dashboard/bulk-orders",
  order: (orderId: string | number) =>
    `/api/proxy/admin/sales-dashboard/bulk-orders/${encodeURIComponent(String(orderId))}`,
  savedOrders: "/api/proxy/admin/sales-dashboard/bulk-orders/saved",
  savedOrder: (orderId: string | number) =>
    `/api/proxy/admin/sales-dashboard/bulk-orders/saved/${encodeURIComponent(String(orderId))}`,
} as const
