import { redirect } from "next/navigation"

import { isSuperAdmin } from "@/features/offline-order/utils/admin-role"
import {
  getPermissions,
  hasPermission,
  type PermissionKey,
  type Permissions,
} from "@/lib/permissions"
import { getUser } from "@/lib/get-user"
import type { AuthUser } from "@/features/auth/types"

export async function requirePermission(permission: PermissionKey) {
  const permissions = await getPermissions()

  if (!hasPermission(permissions, permission)) {
    redirect("/unauthorized")
  }
}

export async function requireSuperAdmin() {
  const user = await getUser()

  if (!isSuperAdmin(user)) {
    redirect("/settings")
  }
}

export async function requirePermissions(): Promise<{
  user: AuthUser
  permissions: Permissions
}> {
  const [user, permissions] = await Promise.all([getUser(), getPermissions()])

  return { user, permissions }
}
