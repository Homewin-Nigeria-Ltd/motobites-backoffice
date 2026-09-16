import { PERMISSION_KEYS, type PermissionKey } from "@/lib/permissions"

export type LandingRoute = {
  permission: PermissionKey
  path: string
}

export const LANDING_ROUTES: LandingRoute[] = [
  { permission: PERMISSION_KEYS.dashboardOverview, path: "/dashboard" },
  { permission: PERMISSION_KEYS.salesDashboard, path: "/offline-order" },
  { permission: PERMISSION_KEYS.orderManagement, path: "/order" },
  { permission: PERMISSION_KEYS.kitchenWorkflow, path: "/kitchen" },
  { permission: PERMISSION_KEYS.revenueAnalytics, path: "/revenue-analytics" },
  { permission: PERMISSION_KEYS.bnpl, path: "/dashboard/bnpl-analytics" },
  { permission: PERMISSION_KEYS.inventoryTracking, path: "/inventory" },
  { permission: PERMISSION_KEYS.menuManagement, path: "/menu" },
  { permission: PERMISSION_KEYS.deliveryManagement, path: "/delivery" },
  { permission: PERMISSION_KEYS.riderChat, path: "/riders/chat" },
  { permission: PERMISSION_KEYS.performance, path: "/performance" },
  { permission: PERMISSION_KEYS.staffManagement, path: "/staff" },
  {
    permission: PERMISSION_KEYS.customerRetentionLoyalty,
    path: "/promotions",
  },
  { permission: PERMISSION_KEYS.customerSupport, path: "/customers/tickets" },
  { permission: PERMISSION_KEYS.settings, path: "/settings" },
]

export const DEFAULT_LANDING_ROUTE = "/unauthorized"
