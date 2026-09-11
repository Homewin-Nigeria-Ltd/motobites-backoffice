import { DashboardSection } from "@/features/dashboard"
import { OfflineOrderOverviewSection } from "@/features/offline-order"
import { shouldShowPosDashboard } from "@/features/offline-order/utils/admin-role"
import { getUser } from "@/lib/get-user"

export default async function DashboardPage() {
  const user = await getUser()

  if (shouldShowPosDashboard(user)) {
    return <OfflineOrderOverviewSection />
  }

  return <DashboardSection />
}
