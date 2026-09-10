export type SalesTransactionSummary = {
  todayTransactions: number
  todayTransactionsBadge: string
  todayRevenue: number
  todayRevenueBadge: string
  pendingOrders: number
  pendingOrdersBadge: string
  activeStaff: number
  activeStaffBadge: string
}

export type SalesTransactionRow = {
  id: string
  transactionNumber: string
  customerName: string
  source: string
  sourceLabel: string
  amount: number
  timeLabel: string
}

export type SalesTransactionHistoryPreviewRow = {
  transactionNumber: string
  amount: number
  status: string
}

export type SalesTransactionHistorySummary = {
  totalTransactions: number
  totalTransactionsBadge: string
  totalTransactionsSubtitle: string
  totalRevenue: number
  totalRevenueBadge: string
  totalRevenueSubtitle: string
  averageOrderValue: number
  averageOrderValueBadge: string
  averageOrderValueSubtitle: string
  refundedCount: number
  refundedAmount: number
  refundedBadge: string
  refundedSubtitle: string
}

export type SalesTransactionHistoryRow = {
  id: string
  transactionNumber: string
  dateTimeLabel: string
  customerName: string
  source: string
  sourceLabel: string
  itemsOrdered: string
  amount: number
  paymentMethod: string
  staff: string
  status: string
  statusLabel: string
}

export type SalesTransactionHistoryFilters = {
  search: string
  source: string
  method: string
  status: string
}

export type SalesTransactionRecentParams = {
  limit?: number
  payment_method?: string
  date_from?: string
  date_to?: string
}

export type ApiSalesTransactionRecent = {
  id: string
  transaction_id: string
  reference: string
  customer: string
  source: string
  sales_rep: string
  amount: number
  amount_kobo: number
  payment_method: string
  status: string
  time: string
  paid_at: string
  order_id: string
  order_ref: string
}

export type ApiSalesTransactionRecentListMeta = {
  count: number
}

export type ApiSalesTransactionRecentListResponse = {
  success: boolean
  data: ApiSalesTransactionRecent[]
  meta?: ApiSalesTransactionRecentListMeta
  message?: string
}

export type SalesTransactionExportParams = {
  date_from?: string
  date_to?: string
  source?: string
  payment_method?: string
  status?: string
  search?: string
}

export type SalesTransactionListParams = SalesTransactionExportParams & {
  page?: number
  per_page?: number
}

export type ApiSalesTransactionItem = {
  id: number | string
  name: string
  quantity: number
  kitchen?: {
    id: number | null
    name: string | null
  } | null
  label?: string
}

export type ApiSalesTransaction = {
  id: string
  transaction_id: string
  reference: string
  order_id: string
  order_ref: string
  paid_at: string
  date: string
  time: string
  time_ago: string
  customer: string
  customer_phone?: string | null
  source: string
  source_label: string
  items: ApiSalesTransactionItem[]
  items_summary: string
  amount: number
  amount_kobo: number
  payment_method: string
  method_label: string
  staff: string
  staff_id?: number
  status: string
}

export type ApiSalesTransactionSummary = {
  total_transactions: number
  total_revenue: number
  total_revenue_kobo: number
  avg_order_value: number
  avg_order_value_kobo: number
  refunded_count: number
  refunded_amount: number
  refunded_amount_kobo: number
}

export type ApiSalesTransactionListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  summary: ApiSalesTransactionSummary
}

export type ApiSalesTransactionListResponse = {
  success: boolean
  data: ApiSalesTransaction[]
  meta: ApiSalesTransactionListMeta
  message?: string
}

export type SalesTransactionAnalyticsSummary = {
  totalRevenue: number
  totalRevenueBadge: string
  totalRevenueSubtitle: string
  transactionCount: number
  transactionCountBadge: string
  transactionCountSubtitle: string
  averageOrderValue: number
  averageOrderValueBadge: string
  averageOrderValueSubtitle: string
  completionRate: number
  completionRateBadge: string
  completionRateSubtitle: string
}

export type SalesTransactionRevenueSourceBreakdown = {
  key: string
  label: string
  percent: number
  amount: number
  color: string
}

export type SalesTransactionPaymentMethodBreakdown = {
  label: string
  percent: number
  amount: number
  barClassName: string
}

export type SalesTransactionRevenueTrendPoint = {
  date: string
  walk_in: number
  whatsapp: number
  glovo: number
  web: number
  chowdeck: number
}

export type SalesTransactionTopItemRow = {
  rank: number
  name: string
  source: string
  sourceLabel: string
  unitsSold: number
  revenue: number
}
