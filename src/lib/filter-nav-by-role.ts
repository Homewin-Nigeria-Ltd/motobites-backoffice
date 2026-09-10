import type { NavItem } from "@/config/sidebar"
import type { AuthUser } from "@/features/auth/types"
import { getAdminRoleSlug } from "@/features/offline-order/utils/admin-role"

export function filterNavItemsByRole(
  items: NavItem[],
  user: AuthUser,
): NavItem[] {
  const roleSlug = getAdminRoleSlug(user)

  return items.map((item) => {
    if (!item.items?.length) {
      return item
    }

    return {
      ...item,
      items: item.items.filter(
        (subItem) => !subItem.adminRole || subItem.adminRole === roleSlug,
      ),
    }
  })
}
