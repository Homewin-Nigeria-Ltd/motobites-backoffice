import { cache } from "react"

import type { AuthUser } from "@/features/auth/types"
import { getUser } from "@/lib/get-user"

export const PERMISSION_KEYS = {
  orderManagement: "order_management",
  kitchenWorkflow: "kitchen_workflow",
  revenueAnalytics: "revenue_analytics",
  inventoryTracking: "inventory_tracking",
  menuManagement: "menu_management",
  deliveryManagement: "delivery_management",
  riderChat: "rider_chat",
  performance: "performance",
  staffManagement: "staff_management",
  technicalReport: "technical_report",
  customerRetentionLoyalty: "customer_retention_loyalty",
  customerSupport: "customer_support",
  settings: "settings",
} as const

export type PermissionKey =
  (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS]

export type Permissions = {
  canAccessOrderManagement: boolean
  canAccessKitchenWorkflow: boolean
  canAccessRevenueAnalytics: boolean
  canAccessInventoryTracking: boolean
  canAccessMenuManagement: boolean
  canAccessDeliveryManagement: boolean
  canAccessRiderChat: boolean
  canAccessPerformance: boolean
  canAccessStaffManagement: boolean
  canAccessTechnicalReport: boolean
  canAccessCustomerRetentionLoyalty: boolean
  canAccessCustomerSupport: boolean
  canAccessSettings: boolean
}

function userHasPermission(user: AuthUser, permission: PermissionKey) {
  if ((user.permission_keys ?? []).includes(permission)) {
    return true
  }

  return user.permissions?.some((entry) => entry.key === permission) ?? false
}

function buildPermissions(user: AuthUser): Permissions {
  return {
    canAccessOrderManagement: userHasPermission(
      user,
      PERMISSION_KEYS.orderManagement,
    ),
    canAccessKitchenWorkflow: userHasPermission(
      user,
      PERMISSION_KEYS.kitchenWorkflow,
    ),
    canAccessRevenueAnalytics: userHasPermission(
      user,
      PERMISSION_KEYS.revenueAnalytics,
    ),
    canAccessInventoryTracking: userHasPermission(
      user,
      PERMISSION_KEYS.inventoryTracking,
    ),
    canAccessMenuManagement: userHasPermission(
      user,
      PERMISSION_KEYS.menuManagement,
    ),
    canAccessDeliveryManagement: userHasPermission(
      user,
      PERMISSION_KEYS.deliveryManagement,
    ),
    canAccessRiderChat: userHasPermission(user, PERMISSION_KEYS.riderChat),
    canAccessPerformance: userHasPermission(user, PERMISSION_KEYS.performance),
    canAccessStaffManagement: userHasPermission(
      user,
      PERMISSION_KEYS.staffManagement,
    ),
    canAccessTechnicalReport: userHasPermission(
      user,
      PERMISSION_KEYS.technicalReport,
    ),
    canAccessCustomerRetentionLoyalty: userHasPermission(
      user,
      PERMISSION_KEYS.customerRetentionLoyalty,
    ),
    canAccessCustomerSupport: userHasPermission(
      user,
      PERMISSION_KEYS.customerSupport,
    ),
    canAccessSettings: userHasPermission(user, PERMISSION_KEYS.settings),
  }
}

export const getPermissions = cache(async (): Promise<Permissions> => {
  const user = await getUser()

  return buildPermissions(user)
})

const permissionFlagByKey: Record<PermissionKey, keyof Permissions> = {
  [PERMISSION_KEYS.orderManagement]: "canAccessOrderManagement",
  [PERMISSION_KEYS.kitchenWorkflow]: "canAccessKitchenWorkflow",
  [PERMISSION_KEYS.revenueAnalytics]: "canAccessRevenueAnalytics",
  [PERMISSION_KEYS.inventoryTracking]: "canAccessInventoryTracking",
  [PERMISSION_KEYS.menuManagement]: "canAccessMenuManagement",
  [PERMISSION_KEYS.deliveryManagement]: "canAccessDeliveryManagement",
  [PERMISSION_KEYS.riderChat]: "canAccessRiderChat",
  [PERMISSION_KEYS.performance]: "canAccessPerformance",
  [PERMISSION_KEYS.staffManagement]: "canAccessStaffManagement",
  [PERMISSION_KEYS.technicalReport]: "canAccessTechnicalReport",
  [PERMISSION_KEYS.customerRetentionLoyalty]: "canAccessCustomerRetentionLoyalty",
  [PERMISSION_KEYS.customerSupport]: "canAccessCustomerSupport",
  [PERMISSION_KEYS.settings]: "canAccessSettings",
}

export function hasPermission(
  permissions: Permissions,
  permission: PermissionKey | null,
) {
  if (!permission) {
    return true
  }

  return permissions[permissionFlagByKey[permission]]
}
