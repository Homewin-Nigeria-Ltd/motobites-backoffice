import type { DashboardPeriod } from "./enums/dashboard-period"

export type { DashboardPeriod }

export type DashboardTrend = "up" | "down"

export type DashboardOverviewParams = {
  period: DashboardPeriod
  from?: string
  to?: string
}

export type DashboardKpi = {
  key: string
  label: string
  value?: number | null
  value_kobo?: number | null
  formatted_value: string | number
  change_percent: number
  trend: DashboardTrend | string
}

export type DashboardSeriesPoint = {
  label?: string
  value?: number
}

export type DashboardSalesRevenuePoint = {
  label: string
  amount_kobo: number
  formatted_amount: string
}

export type DashboardMotopilotRider = {
  serial: number
  rider_id: number
  name: string
  zone: string
  total_rides: number
}

export type DashboardTopSellingEntry = {
  name: string
  revenue?: number
  revenue_kobo?: number
  formatted_revenue: string
}

export type DashboardInventoryItem = {
  id: number
  name: string
  status: string
  status_label: string
  last_restock_at: string
}

export type DashboardPerformanceMetric = {
  key: string
  label: string
  value: number
  formatted_value: string | number
  suffix?: string
  change_percent: number
  trend: DashboardTrend | string
  total?: number
  display?: string
}

export type DashboardRecentCustomer = {
  id?: number | string
  name: string
  phone?: string | null
  email?: string | null
  delivery_address?: string | null
  date_joined?: string | null
  joined_at?: string | null
  total_orders?: number
  lifetime_value_kobo?: number | null
  lifetime_value_formatted?: string | null
  last_order_date?: string | null
  average_order_value_kobo?: number | null
  average_order_value_formatted?: string | null
  preferred_payment_method?: string | null
  acquisition_source?: string | null
}

export type DashboardCustomerInformation = {
  total_customers: number
  recent_customers: DashboardRecentCustomer[]
}

export type DashboardMostOrderedMeal = {
  id?: number | string
  name: string
  order_count?: number
  orders_count?: number
  quantity?: number
  revenue_kobo?: number | null
  revenue_formatted?: string | null
}

export type DashboardPeakOrderingHour = {
  hour?: number | string
  label?: string
  orders?: number
  orders_count?: number
  value?: number
}

export type DashboardPeakOrderingDay = {
  day?: string
  label?: string
  orders?: number
  orders_count?: number
  value?: number
}

export type DashboardOrderAnalytics = {
  total_orders: number
  completed_orders: number
  cancelled_orders: number
  failed_orders: number
  pending_orders: number
  average_delivery_time_minutes?: number | null
  average_preparation_time_minutes?: number | null
  most_ordered_meals?: DashboardMostOrderedMeal[]
  peak_ordering_hours?: DashboardPeakOrderingHour[]
  peak_ordering_days?: DashboardPeakOrderingDay[]
}

export type DashboardCustomerBehaviour = {
  new_customers: number
  returning_customers: number
  dormant_customers?: {
    "30_days"?: number
    "60_days"?: number
    "90_days"?: number
  }
  first_time_buyers?: number
  repeat_purchase_rate?: number | string
  customer_retention_rate?: number | string
  churn_rate?: number | string
}

export type DashboardAcquisitionSource = {
  source: string
  label?: string
  customers?: number
  count?: number
  total?: number
  percentage?: number
}

export type DashboardMarketingData = {
  total_acquired: number
  acquisition_sources: DashboardAcquisitionSource[] | Record<string, number>
}

export type DashboardGreeting = {
  title?: string
  message?: string
}

export type DashboardOverviewData = {
  period: {
    key: string
    from: string
    to: string
    previous_from?: string
    previous_to?: string
  }
  fulfillment_branch_id?: number | null
  greeting?: DashboardGreeting
  kpis?: DashboardKpi[]
  order_frequency?: {
    total_orders: number
    change_percent: number
    trend: DashboardTrend | string
    series: DashboardSeriesPoint[]
  }
  top_motopilots?: {
    total_rides: number
    riders: DashboardMotopilotRider[]
  }
  sales_revenue?: {
    total_kobo: number
    formatted_total: string
    series: DashboardSalesRevenuePoint[]
  }
  daily_traffic?: {
    new_users: number
    change_percent: number
    trend: DashboardTrend | string
    series: DashboardSeriesPoint[]
  }
  inventory_status?: {
    source?: string
    items: DashboardInventoryItem[]
  }
  top_selling?: {
    combos: DashboardTopSellingEntry[]
    items: DashboardTopSellingEntry[]
    kitchens: DashboardTopSellingEntry[]
  }
  performance_metrics?: DashboardPerformanceMetric[]
  customer_information?: DashboardCustomerInformation
  order_analytics?: DashboardOrderAnalytics
  customer_behaviour?: DashboardCustomerBehaviour
  marketing_data?: DashboardMarketingData
}

export type DashboardOverviewResponse = {
  success: boolean
  data: DashboardOverviewData
  message?: string
}

export type OperationalBestSellingProduct = {
  rank: number
  product: string
  menu_item_id: number
  unit_price: number
  unit_price_kobo: number
  units: number
  sales_kobo: number
  sales: number
}

export type ProductCategoryPerformance = {
  category: string
  units: number
  sales_kobo: number
  sales: number
  aov_kobo: number
  contribution_percent: number
  growth_percent: number
}

export type PaymentPerformanceStatus = {
  count: number
  amount_kobo: number
}

export type PaymentPerformanceMethod = {
  method: string
  successful: PaymentPerformanceStatus
  failed: PaymentPerformanceStatus
  pending: PaymentPerformanceStatus
  refunded: PaymentPerformanceStatus
}

export type DiscountsPromotionsRefunds = {
  discounted_or_promotional_orders: number
  discounted_or_promotional_sales_kobo: number
  discount_given_kobo: number
  refund_count: number
  refund_amount_kobo: number
}

export type OrderChannelReportItem = {
  channel?: string
  name?: string
  units?: number
  orders_count?: number
  sales_kobo?: number
  sales?: number
  percentage?: number
  [key: string]: unknown
}

export type OperationalReportsData = {
  period: {
    key: string
    from: string
    to: string
  }
  scope?: string
  best_selling_products: OperationalBestSellingProduct[]
  product_category_performance: ProductCategoryPerformance[]
  order_channel_report?: OrderChannelReportItem[]
  discounts_promotions_refunds: DiscountsPromotionsRefunds
  payment_performance: PaymentPerformanceMethod[]
  sales_kobo?: number
  sales_growth_percent?: number
}

export type OperationalReportsResponse = {
  success: boolean
  data: OperationalReportsData
  message?: string
}
