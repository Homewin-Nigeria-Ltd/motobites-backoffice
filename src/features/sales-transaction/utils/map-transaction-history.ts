import { resolveOfflineOrderAmount } from "@/features/offline-order/utils/order-totals"
import type {
  ApiSalesTransaction,
  ApiSalesTransactionSummary,
} from "@/features/sales-transaction/types"
import type {
  SalesTransactionHistoryRow,
  SalesTransactionHistorySummary,
} from "@/features/sales-transaction/types"

export function formatTransactionStatusLabel(status: string) {
  const normalized = status.toLowerCase()

  if (normalized.includes("success") || normalized.includes("complete")) {
    return "Completed"
  }

  if (normalized.includes("pending")) {
    return "Pending"
  }

  if (normalized.includes("fail")) {
    return "Failed"
  }

  if (normalized.includes("refund")) {
    return "Refunded"
  }

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function mapApiTransactionToHistoryRow(
  transaction: ApiSalesTransaction,
): SalesTransactionHistoryRow {
  const dateTimeLabel =
    transaction.date && transaction.time
      ? `${transaction.date} • ${transaction.time}`
      : transaction.time_ago

  return {
    id: transaction.id,
    transactionNumber: transaction.transaction_id || transaction.reference,
    dateTimeLabel,
    customerName: transaction.customer?.trim() || "Walk-in Customer",
    source: transaction.source,
    sourceLabel: transaction.source_label || transaction.source,
    itemsOrdered: transaction.items_summary,
    amount: transaction.amount,
    paymentMethod: transaction.method_label || transaction.payment_method,
    staff: transaction.staff || "—",
    status: transaction.status,
    statusLabel: formatTransactionStatusLabel(transaction.status),
  }
}

export function createEmptyTransactionHistorySummary(): SalesTransactionHistorySummary {
  return {
    totalTransactions: 0,
    totalTransactionsBadge: "",
    totalTransactionsSubtitle: "Across all dining channels",
    totalRevenue: 0,
    totalRevenueBadge: "",
    totalRevenueSubtitle: "Gross system revenue",
    averageOrderValue: 0,
    averageOrderValueBadge: "",
    averageOrderValueSubtitle: "Average value for selected period",
    refundedCount: 0,
    refundedAmount: 0,
    refundedBadge: "",
    refundedSubtitle: "0% of gross revenue",
  }
}

export function mapApiTransactionsSummary(
  summary: ApiSalesTransactionSummary,
): SalesTransactionHistorySummary {
  const totalRevenue = resolveOfflineOrderAmount(
    summary.total_revenue,
    summary.total_revenue_kobo,
  )
  const averageOrderValue = resolveOfflineOrderAmount(
    summary.avg_order_value,
    summary.avg_order_value_kobo,
  )
  const refundedAmount = resolveOfflineOrderAmount(
    summary.refunded_amount,
    summary.refunded_amount_kobo,
  )
  const refundedPercent =
    totalRevenue > 0
      ? ((refundedAmount / totalRevenue) * 100).toFixed(2)
      : "0.00"

  return {
    totalTransactions: summary.total_transactions ?? 0,
    totalTransactionsBadge: "",
    totalTransactionsSubtitle: "Across all dining channels",
    totalRevenue,
    totalRevenueBadge: "",
    totalRevenueSubtitle: "Gross system revenue",
    averageOrderValue: Math.round(averageOrderValue),
    averageOrderValueBadge: "",
    averageOrderValueSubtitle: "Average value for selected period",
    refundedCount: summary.refunded_count ?? 0,
    refundedAmount,
    refundedBadge: "",
    refundedSubtitle: `${refundedPercent}% of gross revenue`,
  }
}
