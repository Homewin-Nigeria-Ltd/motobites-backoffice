import { BnplAnalyticsSection } from "@/features/dashboard"
import { PERMISSION_KEYS } from "@/lib/permissions"
import { requirePermission } from "@/lib/require-permission"

export const metadata = {
  title: "BNPL Analytics | MotoBites Backoffice",
  description:
    "Comprehensive BNPL portfolio health, repayment tracking, funnel conversion, and financial profitability analytics.",
}

export default async function BnplAnalyticsPage() {
  await requirePermission(PERMISSION_KEYS.bnpl)

  return <BnplAnalyticsSection />
}
