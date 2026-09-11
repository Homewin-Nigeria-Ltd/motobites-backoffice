import { getOrderSourceLabel } from "@/features/offline-order/utils/order-checkout"
import { resolveOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import type {
  ApiSalesTransactionAnalyticsPreviewDay,
  ApiSalesTransactionManagement,
  SalesTransactionAnalyticsPreview,
  SalesTransactionSummary,
} from "@/features/sales-transaction/types"
import {
  mapApiRecentTransactionsToHistoryPreview,
  mapApiRecentTransactionsToRows,
} from "@/features/sales-transaction/utils/map-recent-transactions"

export function mapTransactionAnalyticsPreview(
  preview: ApiSalesTransactionAnalyticsPreviewDay[] = [],
): SalesTransactionAnalyticsPreview | null {
  const latest = preview[0]

  if (!latest?.sources?.length) {
    return null
  }

  const sources = latest.sources.map((item) => ({
    source: item.source,
    sourceLabel: getOrderSourceLabel(item.source),
    revenue: resolveOfflineOrderAmount(item.revenue, item.revenue_kobo),
  }))

  const totalRevenue = sources.reduce((sum, item) => sum + item.revenue, 0)

  return {
    date: latest.date,
    sources: sources
      .map((item) => ({
        ...item,
        percent:
          totalRevenue > 0
            ? Math.round((item.revenue / totalRevenue) * 100)
            : 0,
      }))
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 5),
  }
}

export function mapTransactionManagementToSummary(
  data: ApiSalesTransactionManagement,
): SalesTransactionSummary {
  const pendingOrders = data.pending_orders?.count ?? 0

  return {
    todayTransactions: data.today_transactions?.count ?? 0,
    todayTransactionsBadge: "Today",
    todayRevenue: resolveOfflineOrderAmount(
      data.today_revenue?.amount,
      data.today_revenue?.amount_kobo,
    ),
    todayRevenueBadge: "Today",
    pendingOrders,
    pendingOrdersBadge:
      pendingOrders > 0 ? "Needs attention" : "All clear",
    activeStaff: data.active_staff?.count ?? 0,
    activeStaffBadge: "On Duty",
  }
}

export function mapTransactionManagementViewModel(
  data: ApiSalesTransactionManagement,
) {
  return {
    summary: mapTransactionManagementToSummary(data),
    historyPreview: mapApiRecentTransactionsToHistoryPreview(
      data.transaction_history_preview ?? [],
    ),
    recentTransactions: mapApiRecentTransactionsToRows(
      data.recent_transactions ?? [],
    ),
    analyticsPreview: mapTransactionAnalyticsPreview(
      data.transaction_analytics_preview ?? [],
    ),
  }
}
