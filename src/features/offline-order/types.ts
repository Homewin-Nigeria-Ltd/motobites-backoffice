export type OfflineOrderCartAddon = {
  id: number
  name: string
  price: number
  groupName: string
}

export type OfflineOrderCartItem = {
  lineId: string
  itemId: string
  name: string
  basePrice: number
  price: number
  image: string | null
  kitchenId: string
  kitchenName: string
  quantity: number
  addons?: OfflineOrderCartAddon[]
}

export type OfflineOrderKitchenFilter = "all" | string

export type OfflineOrderSort =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "name"

export type SalesDashboardMenuItemsParams = {
  kitchen_id: number
  search?: string
  per_page?: number
  page?: number
}

export type SalesDashboardOrdersParams = {
  search?: string
  per_page?: number
  page?: number
  fulfillment_branch_id?: number | null
}

export type SalesDashboardRecentTransactionsParams = {
  limit?: number
  payment_method?: string
  date_from?: string
  date_to?: string
  fulfillment_branch_id?: number | null
}

export type ApiSalesDashboardKitchenOpeningHoursDay = {
  open: string
  close: string
}

export type ApiSalesDashboardMenuItemModifier = {
  id: number
  name: string
  description: string | null
  price: number
  additional_price: number
  price_kobo: number
  group_name: string
  type: string
  is_required: boolean
  is_active: boolean
}

export type ApiSalesDashboardMenuItemModifierGroup = {
  group_name: string
  display_name: string
  is_required: boolean
  min_select: number
  max_select: number
  options: ApiSalesDashboardMenuItemModifier[]
  addons: ApiSalesDashboardMenuItemModifier[]
  sub_variations: ApiSalesDashboardMenuItemModifier[]
}

export type ApiSalesDashboardKitchen = {
  id: number
  name: string
  description: string | null
  image: string | null
  is_active: boolean
  is_open: boolean
  is_available: boolean
  opening_hours?: Record<string, ApiSalesDashboardKitchenOpeningHoursDay>
  lat?: number | null
  lng?: number | null
  count?: number
  items_count?: number
  menu_items_count?: number
  total_items_count?: number
  menu_items: ApiSalesDashboardMenuItem[]
}

export type ApiSalesDashboardKitchensResponse = {
  success: boolean
  data: ApiSalesDashboardKitchen[]
  message?: string
}

export type ApiSalesDashboardMenuItem = {
  id: number
  kitchen_id: number
  category_id?: number
  name: string
  description: string | null
  image: string | null
  price: number
  original_price?: number
  deal_price?: number | null
  current_price?: number
  preparation_time_minutes?: number
  is_available?: boolean
  is_combo?: boolean
  tags?: string[]
  kitchen?: {
    id: number
    name: string
  } | null
  category?: {
    id: number
    name: string
  }
  modifier_groups?: ApiSalesDashboardMenuItemModifierGroup[]
  modifiers?: ApiSalesDashboardMenuItemModifier[]
  addons?: ApiSalesDashboardMenuItemModifier[]
}

export type ApiSalesDashboardMenuItemsMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiSalesDashboardMenuItemsResponse = {
  success: boolean
  data: ApiSalesDashboardMenuItem[]
  meta: ApiSalesDashboardMenuItemsMeta
  message?: string
}

export type ApiSalesDashboardOrderItem = {
  id?: number | string
  menu_item_id?: number
  name: string
  quantity: number
  price?: number
  unit_price?: number | string
  subtotal?: number
  subtotal_kobo?: number
  total?: number
  image?: string | null
  kitchen_id?: number
  kitchen_name?: string
  modifiers?: unknown[]
  addons?: unknown[]
  modifiers_snapshot?: unknown[]
}

export type ApiSalesDashboardOrder = {
  id: number | string
  reference_number?: string
  order_number?: string
  customer_name?: string | null
  customer_phone?: string | null
  payment_method?: string
  order_source?: string
  status?: string
  display_status?: string
  subtotal?: number
  subtotal_kobo?: number
  service_fee?: number
  total?: number
  total_kobo?: number
  total_amount?: number
  amount_paid?: number
  items_count?: number
  notes?: string | null
  created_at?: string
  updated_at?: string
  completed_at?: string
  saved_at?: string
  time_saved?: string
  ordered_at?: string
  order_date?: string
  order_time?: string
  time_ago?: string
  kitchen?: {
    id: number
    name: string
  } | null
  sales_rep?: {
    id: number
    name: string
    avatar?: string | null
  } | null
  assigned_to?: {
    id: number
    name: string
    avatar?: string | null
  } | null
  taken_by?: {
    id: number
    name: string
    avatar?: string | null
  } | null
  items?: ApiSalesDashboardOrderItem[]
}

export type ApiSalesDashboardOrdersMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiSalesDashboardOrdersResponse = {
  success: boolean
  data: ApiSalesDashboardOrder[]
  meta: ApiSalesDashboardOrdersMeta
  saved_orders_count?: number
  message?: string
}

export type ApiSalesDashboardDeleteRequest = {
  id: number | string
  order_id: number | string
  reason?: string | null
  notes?: string | null
  status?: string
  created_at?: string
  order?: ApiSalesDashboardOrder
  requested_by?: {
    id: number
    name: string
  } | null
}

export type ApiSalesDashboardDeleteRequestsResponse = {
  success: boolean
  data: ApiSalesDashboardDeleteRequest[]
  meta: ApiSalesDashboardOrdersMeta
  message?: string
}

export type CreateOfflineOrderDeleteRequestPayload = {
  reason: string
}

export type ApproveOfflineOrderDeletionPayload = {
  reason: string
}

export type ApiOfflineOrderDeleteRequestResponse = {
  success: boolean
  data?: ApiSalesDashboardDeleteRequest
  message?: string
}

export type ApiOfflineOrderCancelResponse = {
  success: boolean
  data?: ApiSalesDashboardOrder
  message?: string
}

export type ApiSalesDashboardMetricCount = {
  count: number
  badge: string
}

export type ApiSalesDashboardMetricRevenue = {
  amount: number
  amount_kobo: number
  badge: string
}

export type ApiSalesDashboardOverviewMetrics = {
  active_orders: ApiSalesDashboardMetricCount
  saved_on_hold: ApiSalesDashboardMetricCount
  completed_today: ApiSalesDashboardMetricCount
  today_offline_revenue: ApiSalesDashboardMetricRevenue
}

export type ApiSalesDashboardOverviewStaff = {
  id: number
  rank: number
  name: string
  avatar?: string | null
  orders_count: number
  orders_label?: string
  revenue: number
  revenue_kobo?: number
  avg_value: number
  avg_value_kobo?: number
  status: "active" | "offline" | string
}

export type ApiSalesDashboardOverviewActivity = {
  id?: number | string
  title: string
  badge: string
  badge_type: string
  time_ago: string
  timestamp?: number
}

export type ApiSalesDashboardStatsResponse = {
  success: boolean
  data: ApiSalesDashboardOverviewMetrics
  message?: string
}

export type ApiSalesDashboardTopStaffResponse = {
  success: boolean
  data: ApiSalesDashboardOverviewStaff[]
  message?: string
}

export type ApiSalesDashboardRecentActivityResponse = {
  success: boolean
  data: ApiSalesDashboardOverviewActivity[]
  message?: string
}

export type ApiSalesDashboardRecentTransaction = {
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

export type ApiSalesDashboardRecentTransactionsMeta = {
  count: number
}

export type ApiSalesDashboardRecentTransactionsResponse = {
  success: boolean
  data: ApiSalesDashboardRecentTransaction[]
  meta?: ApiSalesDashboardRecentTransactionsMeta
  message?: string
}

export type SalesDashboardOperationalReportsPeriod =
  | "day"
  | "week"
  | "month"
  | "year"

export type SalesDashboardOperationalReportsParams = {
  period?: SalesDashboardOperationalReportsPeriod
}

export type ApiSalesDashboardOperationalReportPeriod = {
  key: string
  from: string
  to: string
}

export type ApiSalesDashboardBestSellingProduct = {
  rank: number
  product: string
  menu_item_id: number
  unit_price: number
  unit_price_kobo: number
  units: number
  sales_kobo: number
  sales: number
}

export type ApiSalesDashboardProductCategoryPerformance = {
  category: string
  units: number
  sales_kobo: number
  sales: number
  aov_kobo: number
  contribution_percent: number
  growth_percent: number
}

export type ApiSalesDashboardOrderChannelReport = {
  kitchen_id: number
  kitchen: string
  channel: string
  orders: number
  sales_kobo: number
  sales: number
}

export type ApiSalesDashboardDiscountsPromotionsRefunds = {
  discounted_or_promotional_orders: number
  discounted_or_promotional_sales_kobo: number
  discount_given_kobo: number
  refund_count: number
  refund_amount_kobo: number
}

export type ApiSalesDashboardPaymentPerformanceStatus = {
  count: number
  amount_kobo: number
}

export type ApiSalesDashboardPaymentPerformance = {
  method: string
  successful: ApiSalesDashboardPaymentPerformanceStatus
  failed: ApiSalesDashboardPaymentPerformanceStatus
  pending: ApiSalesDashboardPaymentPerformanceStatus
  refunded: ApiSalesDashboardPaymentPerformanceStatus
}

export type ApiSalesDashboardOperationalReports = {
  period: ApiSalesDashboardOperationalReportPeriod
  scope: string
  best_selling_products: ApiSalesDashboardBestSellingProduct[]
  product_category_performance: ApiSalesDashboardProductCategoryPerformance[]
  order_channel_report: ApiSalesDashboardOrderChannelReport[]
  discounts_promotions_refunds: ApiSalesDashboardDiscountsPromotionsRefunds
  payment_performance: ApiSalesDashboardPaymentPerformance[]
  sales_kobo: number
  sales: number
  sales_growth_percent: number
}

export type ApiSalesDashboardOperationalReportsResponse = {
  success: boolean
  data: ApiSalesDashboardOperationalReports
  message?: string
}

export type OfflineOrderOverviewSummary = {
  activeOrders: number
  activeOrdersBadge: string
  savedOnHold: number
  savedOnHoldBadge: string
  completedToday: number
  completedTodayBadge: string
  todayRevenue: number
  todayRevenueBadge: string
}

export type OfflineOrderOverviewOrderRow = {
  id: string
  orderNumber: string
  customerName: string
  itemsCount: number
  total: number
  timeLabel: string
}

export type OfflineOrderOverviewStaffRow = {
  id: number
  rank: number
  name: string
  avatar: string | null
  ordersCount: number
  ordersLabel: string
  revenue: number
  averageValue: number
  status: "active" | "offline"
}

export type OfflineOrderOverviewActivityRow = {
  id: string
  title: string
  badge: string
  badgeType: string
  timeLabel: string
}

export type OfflineOrderOverviewTransactionRow = {
  id: string
  transactionNumber: string
  customerName: string
  source: string
  sourceLabel: string
  amount: number
  paymentMethod: string
  timeLabel: string
}

export type OfflineOrderOverviewViewModel = {
  summary: OfflineOrderOverviewSummary
  savedOrders: OfflineOrderOverviewOrderRow[]
  completedOrders: OfflineOrderOverviewOrderRow[]
  topSalesStaff: OfflineOrderOverviewStaffRow[]
  recentActivity: OfflineOrderOverviewActivityRow[]
  recentTransactions: OfflineOrderOverviewTransactionRow[]
}

export type OfflineOrderSavedSort = "time_saved" | "total_amount" | "customer"

export type OfflineOrderPaymentMethod =
  | "cash"
  | "pos_card"
  | "bank_transfer"
  | "staff_credit"
  | "chowdeck"
  | "glovo"

export type OfflineOrderOrderSource =
  | "walk_in"
  | "whatsapp"
  | "web"
  | "glovo"
  | "chowdeck"
  | "staff_credit"

export type CreateOfflineOrderAddonPayload = {
  id: number
  quantity: number
}

export type CreateOfflineOrderItemPayload = {
  menu_item_id: number
  quantity: number
  addons?: CreateOfflineOrderAddonPayload[]
  add_ons?: CreateOfflineOrderAddonPayload[]
  add_on_ids?: number[]
  modifiers?: Record<string, unknown>[]
}

export type CreateOfflineOrderPayload = {
  items: CreateOfflineOrderItemPayload[]
  customer_name?: string
  customer_phone?: string
  payment_method: OfflineOrderPaymentMethod
  order_source: OfflineOrderOrderSource
  fulfillment_branch_id?: number | null
  branch_id?: number | null
  notes?: string
}

export type SaveOfflineOrderPayload = {
  items: CreateOfflineOrderItemPayload[]
  customer_name?: string
  customer_phone?: string
  order_source: OfflineOrderOrderSource
  payment_method: OfflineOrderPaymentMethod
  fulfillment_branch_id?: number | null
  branch_id?: number | null
  notes?: string
}

export type ApiOfflineOrder = {
  id?: number
  order_number?: string
  order_id?: string | number
  customer_name?: string | null
  customer_phone?: string | null
  payment_method?: string
  subtotal?: number
  service_fee?: number
  total?: number
  total_amount?: number
}

export type ApiOfflineOrderResponse = {
  success: boolean
  data: ApiOfflineOrder
  message?: string
}

export type ApiSalesDashboardSavedOrderResponse = {
  success: boolean
  data: ApiSalesDashboardOrder
  message?: string
}

export type ApiSalesDashboardSavedOrderMutationResponse = {
  success: boolean
  data?: ApiSalesDashboardOrder
  message?: string
}

export type OfflineOrderCheckoutDraft = {
  customerName: string
  customerPhone: string
  orderSource: OfflineOrderOrderSource
  paymentMethod: OfflineOrderPaymentMethod
  takenById: string
  takenByName: string
  branchId?: number | null
  branchName?: string | null
  managerVerificationNotes: string
}

export type OfflineOrderSavedOrder = {
  id: string
  orderNumber: string
  items: OfflineOrderCartItem[]
  checkout: OfflineOrderCheckoutDraft
  savedAt: string
}

/** @deprecated Use OfflineOrderSavedOrder */
export type OfflineOrderSavedSnapshot = OfflineOrderSavedOrder

export type OfflineOrderReceipt = {
  orderNumber: string
  items: OfflineOrderCartItem[]
  customerName: string
  customerPhone: string
  paymentMethod: OfflineOrderPaymentMethod
  takenByName: string
  branchName?: string | null
  subtotal: number
  serviceFee: number
  total: number
  placedAt: string
}
