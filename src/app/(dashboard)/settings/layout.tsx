import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requirePermission(PERMISSION_KEYS.settings)

  return children
}
