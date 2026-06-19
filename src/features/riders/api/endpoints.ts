export const ridersEndpoints = {
  list: "/api/proxy/admin/delivery-management/riders",
  create: "/api/proxy/admin/delivery-management/riders",
  detail: (riderId: string | number) =>
    `/api/proxy/admin/delivery-management/riders/${encodeURIComponent(String(riderId))}`,
  update: (riderId: string | number) =>
    `/api/proxy/admin/delivery-management/riders/${encodeURIComponent(String(riderId))}`,
} as const
