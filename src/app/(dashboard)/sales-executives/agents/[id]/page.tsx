import {
  SalesExecutiveAgentSection,
  SalesExecutiveShell,
} from "@/features/sales-executives"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function SalesExecutiveAgentPage({ params }: PageProps) {
  await requirePermission(PERMISSION_KEYS.salesExecutives)
  const { id } = await params

  return (
    <SalesExecutiveShell>
      <SalesExecutiveAgentSection id={decodeURIComponent(id)} />
    </SalesExecutiveShell>
  )
}
