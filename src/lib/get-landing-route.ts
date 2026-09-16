import {
  DEFAULT_LANDING_ROUTE,
  LANDING_ROUTES,
} from "@/config/landing-routes"
import type { AuthUser } from "@/features/auth/types"
import type { PermissionKey } from "@/lib/permissions"

function userHasPermission(user: AuthUser, permission: PermissionKey) {
  if (user.permissions && user.permissions.length > 0) {
    return user.permissions.some(
      (entry) => entry.key === permission && entry.has_access,
    )
  }

  return (user.permission_keys ?? []).includes(permission)
}

export function getLandingRoute(user: AuthUser): string {
  for (const rule of LANDING_ROUTES) {
    if (userHasPermission(user, rule.permission)) {
      return rule.path
    }
  }

  return DEFAULT_LANDING_ROUTE
}
