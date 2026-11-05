import {
  SalesExecutiveShell,
  SalesExecutiveTargetsSection,
} from "@/features/sales-executives"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function SalesExecutiveTargetsPage() {
  await requirePermission(PERMISSION_KEYS.salesExecutives)

  return (
    <SalesExecutiveShell>
      <SalesExecutiveTargetsSection />
    </SalesExecutiveShell>
  )
}
