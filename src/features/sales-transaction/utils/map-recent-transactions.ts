import { getOrderSourceLabel } from "@/features/offline-order/utils/order-checkout"
import type {
  ApiSalesTransactionRecent,
  SalesTransactionHistoryPreviewRow,
  SalesTransactionRow,
} from "@/features/sales-transaction/types"
import { formatTransactionStatusLabel } from "@/features/sales-transaction/utils/map-transaction-history"

function getTransactionNumber(transaction: ApiSalesTransactionRecent) {
  return (
    transaction.transaction_id ||
    transaction.reference ||
    transaction.order_ref ||
    transaction.id
  ).replace(/^#/, "")
}

function getTransactionAmount(transaction: ApiSalesTransactionRecent) {
  return (
    transaction.amount ??
    (transaction.amount_kobo != null ? transaction.amount_kobo / 100 : 0)
  )
}

export function mapApiRecentTransactionToRow(
  transaction: ApiSalesTransactionRecent,
): SalesTransactionRow {
  const source = transaction.source ?? "walk_in"

  return {
    id: transaction.id,
    transactionNumber: getTransactionNumber(transaction),
    customerName: transaction.customer?.trim() || "Walk-in Customer",
    source,
    sourceLabel: getOrderSourceLabel(source),
    amount: getTransactionAmount(transaction),
    timeLabel: transaction.time ?? "Just now",
  }
}

export function mapApiRecentTransactionToHistoryPreview(
  transaction: ApiSalesTransactionRecent,
): SalesTransactionHistoryPreviewRow {
  return {
    transactionNumber: getTransactionNumber(transaction),
    amount: getTransactionAmount(transaction),
    status: formatTransactionStatusLabel(transaction.status),
  }
}

export function mapApiRecentTransactionsToRows(
  transactions: ApiSalesTransactionRecent[],
): SalesTransactionRow[] {
  return transactions.map(mapApiRecentTransactionToRow)
}

export function mapApiRecentTransactionsToHistoryPreview(
  transactions: ApiSalesTransactionRecent[],
  limit = 2,
): SalesTransactionHistoryPreviewRow[] {
  return transactions
    .slice(0, limit)
    .map(mapApiRecentTransactionToHistoryPreview)
}
