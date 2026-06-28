import { PerformanceSection } from "@/features/performance"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function PerformancePage() {
  await requirePermission(PERMISSION_KEYS.performance)

  return <PerformanceSection />
}
