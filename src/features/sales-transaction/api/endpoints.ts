export const salesTransactionEndpoints = {
  transactions: "/api/proxy/admin/sales-dashboard/transactions",
  transactionsExport: "/api/proxy/admin/sales-dashboard/transactions/export",
  recentTransactions: "/api/proxy/admin/sales-dashboard/recent-transactions",
  transactionManagement:
    "/api/proxy/admin/sales-dashboard/transaction-management",
  transactionAnalytics:
    "/api/proxy/admin/sales-dashboard/transaction-analytics",
} as const
