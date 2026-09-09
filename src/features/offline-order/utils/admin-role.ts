import type { AuthUser } from "@/features/auth/types"

export type AuthUserAdminRole = {
  id: number
  slug: string
  name: string
}

export function getAdminRoleSlug(user: AuthUser | null | undefined) {
  if (!user?.admin_role) {
    return null
  }

  if (typeof user.admin_role === "string") {
    return user.admin_role
  }

  return user.admin_role.slug
}

export function isSalesManager(user: AuthUser | null | undefined) {
  return getAdminRoleSlug(user) === "sales-manager"
}

export function isSalesRep(user: AuthUser | null | undefined) {
  return getAdminRoleSlug(user) === "sales-rep"
}
