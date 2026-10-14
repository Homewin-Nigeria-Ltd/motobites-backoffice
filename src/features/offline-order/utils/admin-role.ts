import type { AuthUser } from "@/features/auth/types"

export type AuthUserAdminRole = {
  id: number
  slug: string
  name: string
}

function formatRoleLabel(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
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

export function getAdminRoleLabel(user: AuthUser | null | undefined) {
  if (!user) {
    return null
  }

  if (typeof user.admin_role === "object" && user.admin_role?.name?.trim()) {
    return user.admin_role.name.trim()
  }

  const slug = getAdminRoleSlug(user)
  if (slug) {
    return formatRoleLabel(slug)
  }

  return user.role?.trim() ? formatRoleLabel(user.role) : null
}

export function isSalesManager(user: AuthUser | null | undefined) {
  return getAdminRoleSlug(user) === "sales-manager"
}

export function isSalesRep(user: AuthUser | null | undefined) {
  return getAdminRoleSlug(user) === "sales-rep"
}

export function isSuperAdmin(user: AuthUser | null | undefined) {
  const slug = getAdminRoleSlug(user)?.toLowerCase()
  if (slug === "super-admin" || slug === "super_admin") {
    return true
  }

  const role = user?.role?.toLowerCase()
  return role === "super-admin" || role === "super_admin"
}

export function shouldShowPosDashboard(user: AuthUser | null | undefined) {
  const role = getAdminRoleSlug(user)
  return role === "sales-rep" || role === "sales-manager"
}
