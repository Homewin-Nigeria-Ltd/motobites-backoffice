import { OfflineOrderBackButton } from "@/features/offline-order/components/offline-order-back-button"
import { SalesTransactionAnalyticsStats } from "@/features/sales-transaction/components/sales-transaction-analytics-stats"
import { SalesTransactionAnalyticsToolbar } from "@/features/sales-transaction/components/sales-transaction-analytics-toolbar"
import {
  SalesTransactionRevenueBreakdown,
  SalesTransactionTopItemsTable,
} from "@/features/sales-transaction/components/sales-transaction-revenue-breakdown"
import { SalesTransactionRevenueTrendChart } from "@/features/sales-transaction/components/sales-transaction-revenue-trend-chart"
import {
  SALES_TRANSACTION_ANALYTICS_SUMMARY,
  SALES_TRANSACTION_PAYMENT_METHOD_BREAKDOWN,
  SALES_TRANSACTION_REVENUE_SOURCE_BREAKDOWN,
  SALES_TRANSACTION_REVENUE_TREND,
  SALES_TRANSACTION_TOP_ITEMS,
} from "@/features/sales-transaction/constants/analytics-mock-data"

export function SalesTransactionAnalyticsSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <OfflineOrderBackButton
        href="/offline-order/sales-transaction"
        label="Back to Sales Transaction"
      />

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
        <SalesTransactionAnalyticsToolbar />

        <SalesTransactionAnalyticsStats
          summary={SALES_TRANSACTION_ANALYTICS_SUMMARY}
        />

        <SalesTransactionRevenueTrendChart
          data={SALES_TRANSACTION_REVENUE_TREND}
        />

        <SalesTransactionRevenueBreakdown
          sources={SALES_TRANSACTION_REVENUE_SOURCE_BREAKDOWN}
          paymentMethods={SALES_TRANSACTION_PAYMENT_METHOD_BREAKDOWN}
        />

        <SalesTransactionTopItemsTable items={SALES_TRANSACTION_TOP_ITEMS} />
      </div>
    </div>
  )
}
