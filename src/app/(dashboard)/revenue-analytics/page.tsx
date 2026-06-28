import { RevenueAnalyticsSection } from "@/features/revenue-analytics"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export default async function RevenueAnalyticsPage() {
  await requirePermission(PERMISSION_KEYS.revenueAnalytics)

  return <RevenueAnalyticsSection />
}
