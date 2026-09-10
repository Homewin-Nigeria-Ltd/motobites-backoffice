import { SALES_TRANSACTION_SUMMARY } from "@/features/sales-transaction/constants/mock-data"
import { SalesTransactionQuickActions } from "@/features/sales-transaction/components/sales-transaction-quick-actions"
import { SalesTransactionRecentSection } from "@/features/sales-transaction/components/sales-transaction-recent-section"
import { SalesTransactionStats } from "@/features/sales-transaction/components/sales-transaction-stats"

export function SalesTransactionSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        <SalesTransactionStats summary={SALES_TRANSACTION_SUMMARY} />

        <SalesTransactionRecentSection />

        <SalesTransactionQuickActions />
      </div>
    </div>
  )
}
