import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function OfflineOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requirePermission(PERMISSION_KEYS.salesDashboard)

  return children
}
