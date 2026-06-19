export const deliveryManagementKeys = {
  all: ["delivery-management"] as const,
  dashboard: () => [...deliveryManagementKeys.all, "dashboard"] as const,
} as const
