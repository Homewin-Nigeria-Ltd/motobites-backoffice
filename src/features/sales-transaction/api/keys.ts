import type {
  SalesTransactionAnalyticsParams,
  SalesTransactionListParams,
  SalesTransactionRecentParams,
} from "../types"

export const salesTransactionKeys = {
  all: ["sales-transaction"] as const,
  transactions: (params: SalesTransactionListParams = {}) =>
    [...salesTransactionKeys.all, "transactions", params] as const,
  recentTransactions: (params: SalesTransactionRecentParams = {}) =>
    [...salesTransactionKeys.all, "recent-transactions", params] as const,
  transactionManagement: () =>
    [...salesTransactionKeys.all, "transaction-management"] as const,
  transactionAnalytics: (params: SalesTransactionAnalyticsParams = {}) =>
    [...salesTransactionKeys.all, "transaction-analytics", params] as const,
}
