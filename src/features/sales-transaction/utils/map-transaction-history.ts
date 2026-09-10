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

export function mapApiTransactionsSummary(
  summary: ApiSalesTransactionSummary,
): SalesTransactionHistorySummary {
  const refundedPercent =
    summary.total_revenue > 0
      ? ((summary.refunded_amount / summary.total_revenue) * 100).toFixed(2)
      : "0.00"

  return {
    totalTransactions: summary.total_transactions,
    totalTransactionsBadge: "",
    totalTransactionsSubtitle: "Across all dining channels",
    totalRevenue: summary.total_revenue,
    totalRevenueBadge: "",
    totalRevenueSubtitle: "Gross system revenue",
    averageOrderValue: Math.round(summary.avg_order_value),
    averageOrderValueBadge: "",
    averageOrderValueSubtitle: "Average value for selected period",
    refundedCount: summary.refunded_count,
    refundedAmount: summary.refunded_amount,
    refundedBadge: "",
    refundedSubtitle: `${refundedPercent}% of gross revenue`,
  }
}
