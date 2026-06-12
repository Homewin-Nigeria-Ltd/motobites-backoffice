export type CustomerStatus =
  | "active"
  | "deactivated"
  | "churn"
  | "suspended"
  | "pending"

export type CustomerTab = "all" | "active" | "deactivated" | "churn"

export type Customer = {
  id: string
  userId: string
  name: string
  email: string
  initials: string
  status: CustomerStatus
  statusLabel: string
  joinedAt: string
  phone: string
  todayTransaction: number
  todayTransactionFormatted: string
  walletBalance: number
  walletBalanceFormatted: string
  ordersCount: number
}

export type CustomerTransaction = {
  id: string
  orderNumber: string
  referenceNumber: string
  mealName: string
  itemImage: string | null
  amountPaid: string
  customerName: string
  deliveryAddress: string
  status: string
  displayStatus: string
  riderName: string
  customerRemark: string
  orderedAt: string
  paymentMethod: string
  deliveryTime: string
  customerReview: string
  riderReview: string
  kitchen: string | null
}

export type CustomerCnplTransaction = {
  id: string
  title: string
  description: string
  amount: string
}

export type CustomerDetail = Customer & {
  firstName: string
  lastName: string
  homeAddress: string
  avatar: string | null
  ordersCount: number
  overdraftBalance: number
  overdraftBalanceFormatted: string
  overdraftEligibility: number
  cnplEnabled: boolean
  transactions: CustomerTransaction[]
  cnplTransactions: CustomerCnplTransaction[]
}

export type CustomerTrend = "up" | "down"

export type CustomerSummaryStat = {
  key: CustomerTab
  label: string
  value: number
  changePercent: number
  trend: CustomerTrend
}

export type CustomerListParams = {
  page: number
  per_page?: number
  search?: string
  tab?: CustomerTab
}

export type CustomerListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type CustomerListResponse = {
  items: Customer[]
  meta: CustomerListMeta
}

export type CustomerSummaryResponse = {
  stats: CustomerSummaryStat[]
}

export type ApiCustomer = {
  id: number
  user_code?: string
  user_id?: number | string
  name?: string
  full_name?: string
  first_name?: string
  last_name?: string
  email?: string
  initials?: string
  status?: string
  status_label?: string
  joined_at?: string
  phone?: string | null
  home_address?: string
  today_transaction?: number
  today_transaction_formatted?: string
  today_transaction_amount?: number
  wallet_balance?: number
  wallet_balance_formatted?: string
  orders_count?: number
  overdraft_balance?: number
  overdraft_balance_formatted?: string
  overdraft_eligibility?: number
  transaction_history?: ApiCustomerTransaction[]
  transactions?: ApiCustomerTransaction[]
  cnpl_transactions?: ApiCustomerCnplTransaction[]
  chop_now_pay_later_transactions?: ApiCustomerCnplTransaction[]
}

export type ApiCustomerTransaction = {
  id?: number | string
  order_number?: string
  reference_number?: string
  order_id?: number | string
  meal_name?: string
  item_name?: string
  item_image?: string | null
  amount_paid?: number
  amount_paid_formatted?: string
  customer_name?: string
  delivery_address?: string
  status?: string
  display_status?: string
  rider_name?: string | null
  kitchen?: string | null
  customer_remark?: string
  ordered_at?: string
  created_at?: string
  payment_method?: string
  delivery_time?: string
  customer_review?: string
  rider_review?: string
}

export type ApiCustomerCnplTransaction = {
  id?: number | string
  title?: string
  description?: string
  amount?: number
  amount_formatted?: string
}

export type ApiCustomerListResponse = {
  success?: boolean
  data: ApiCustomer[]
  meta: CustomerListMeta
  message?: string
}

export type ApiCustomerProfile = {
  id: number
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  phone?: string | null
  status?: string
  avatar?: string | null
  joined_at?: string
  home_addresses?: Array<string | { address?: string }>
}

export type ApiCustomerAccount = {
  wallet_balance?: number
  wallet_balance_formatted?: string
  orders_count?: number
  today_transaction?: number
  today_transaction_formatted?: string
}

export type ApiCustomerCnpl = {
  overdraft_balance?: number
  overdraft_balance_formatted?: string
  eligibility_limit?: number
  is_enabled?: boolean
}

export type ApiCustomerDetailData = {
  profile: ApiCustomerProfile
  account?: ApiCustomerAccount
  cnpl?: ApiCustomerCnpl
  cnpl_transactions?: ApiCustomerCnplTransaction[]
  recent_orders?: ApiCustomerTransaction[]
}

export type ApiCustomerResponse = {
  success?: boolean
  data: ApiCustomerDetailData
  message?: string
}

export type ApiCustomerOverviewStat = {
  key?: string
  label?: string
  value?: number
  count?: number
  change_percent?: number
  change?: number
  trend?: CustomerTrend | string
}

export type ApiCustomerOverviewResponse = {
  success?: boolean
  data: {
    kpis?: ApiCustomerOverviewStat[]
  }
  message?: string
}

export type IncreaseCnplEligibilityInput = {
  id: string
  amount: number
}

export type CustomerActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string }
