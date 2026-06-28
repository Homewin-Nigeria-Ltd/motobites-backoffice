import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requirePermission(PERMISSION_KEYS.kitchenWorkflow)

  return children
}
