import {
  SalesExecutiveAgentsSection,
  SalesExecutiveShell,
} from "@/features/sales-executives"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function SalesExecutiveAgentsPage() {
  await requirePermission(PERMISSION_KEYS.salesExecutives)

  return (
    <SalesExecutiveShell>
      <SalesExecutiveAgentsSection />
    </SalesExecutiveShell>
  )
}
