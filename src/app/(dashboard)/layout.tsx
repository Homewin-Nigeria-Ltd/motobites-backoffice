import { DashboardLayout } from "@/components/layouts/dashboard"
import { navMain, navSupport } from "@/config/sidebar"
import { getPermissions, hasPermission } from "@/lib/permissions"
import { getUser } from "@/lib/get-user"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, permissions] = await Promise.all([getUser(), getPermissions()])

  const filteredNavMain = navMain.filter((item) =>
    hasPermission(permissions, item.permission),
  )
  const filteredSupport = navSupport.filter((item) =>
    hasPermission(permissions, item.permission),
  )

  return (
    <DashboardLayout
      user={user}
      filteredNavMain={filteredNavMain}
      filteredSupport={filteredSupport}
    >
      {children}
    </DashboardLayout>
  )
}
