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

export type DeliveryTrendPoint = {
  label: string
  completed: number
  failed: number
  cancelled: number
}

export type DeliveryStatusBreakdownItem = {
  key: string
  label: string
  value: number
  percent: number
}

export type DeliveryLocationItem = {
  label: string
  deliveries: number
}

export type TotalDeliveriesCardData = {
  card: string
  period: {
    key: string
    from: string
    to: string
    previous_from?: string
    previous_to?: string
  }
  fulfillment_branch_id?: number | null
  headline: {
    label: string
    value: number
    value_kobo?: number | null
    formatted_value: string | number
    change_percent: number
    trend: DashboardTrend | string
  }
  summary: {
    total_deliveries: number
    completed_deliveries: number
    failed_deliveries: number
    cancelled_deliveries: number
    average_delivery_time_minutes: number
    average_delivery_fee_kobo: number
    formatted_average_delivery_fee: string
    total_delivery_revenue_kobo: number
    formatted_total_delivery_revenue: string
    total_deliveries_change_percent?: number
    completed_deliveries_change_percent?: number
    failed_deliveries_change_percent?: number
    cancelled_deliveries_change_percent?: number
    average_delivery_time_change_percent?: number
    on_time_delivery_percent?: number
    on_time_delivery_change_percent?: number
    total_delivery_revenue_change_percent?: number
  }
  trend: DeliveryTrendPoint[]
  status_breakdown: DeliveryStatusBreakdownItem[]
  by_location: DeliveryLocationItem[]
  performance: {
    average_prep_time_minutes?: number
    average_rider_pickup_minutes?: number
    average_rider_travel_minutes?: number
    average_order_to_door_minutes?: number
  }
}

export type TotalDeliveriesCardResponse = {
  success: boolean
  data: TotalDeliveriesCardData
  message?: string
}

export type OrderOverTimePoint = {
  label: string
  value: number
  previous_value?: number
}

export type OrderStatusFunnelItem = {
  key: string
  step: number
  label: string
  value: number
  percent: number
  color?: string
}

export type OrderFailureAnalysisItem = {
  key: string
  label: string
  value: number
  percent: number
  trend?: "up" | "down" | string
  color?: string
}

export type FailedOrderFollowUpItem = {
  id: string
  reference: string
  customer_name: string
  customer_phone?: string | null
  status: string
  status_label: string
  created_at?: string
  time_ago: string
}

export type OngoingOrdersCardData = {
  card: string
  period: {
    key: string
    from: string
    to: string
    previous_from?: string
    previous_to?: string
  }
  fulfillment_branch_id?: number | null
  headline: {
    label: string
    value: number
    value_kobo?: number | null
    formatted_value: string | number
    change_percent: number
    trend: DashboardTrend | string
  }
  summary: {
    total_orders: number
    total_orders_change_percent?: number
    new_orders: number
    new_orders_change_percent?: number
    preparing: number
    preparing_change_percent?: number
    ready_for_pickup: number
    ready_for_pickup_change_percent?: number
    out_for_delivery: number
    out_for_delivery_change_percent?: number
    completed: number
    completed_change_percent?: number
    cancelled: number
    cancelled_change_percent?: number
    failed: number
    failed_change_percent?: number
  }
  orders_over_time: OrderOverTimePoint[]
  status_funnel: OrderStatusFunnelItem[]
  failure_analysis: OrderFailureAnalysisItem[]
  failed_orders: FailedOrderFollowUpItem[]
}

export type OngoingOrdersCardResponse = {
  success: boolean
  data: OngoingOrdersCardData
  message?: string
}

export type RevenueTrendPoint = {
  label: string
  day?: string
  amount_kobo: number
  gross_revenue?: number
  net_revenue?: number
  gross_revenue_kobo?: number
  net_revenue_kobo?: number
  formatted_amount: string
  formatted_gross?: string
  formatted_net?: string
}

export type PaymentChannelPerformanceItem = {
  key: string
  label: string
  amount_kobo: number
  formatted_amount: string
  percent: number
  success_rate: number
  color: string
}

export type ProductCategoryPerformanceItem = {
  category: string
  orders_count: number
  units: number
  sales_kobo: number
  formatted_sales: string
  percent: number
  trend: "up" | "down" | string
  color: string
}

export type OperationalSalesData = {
  gross_sales: {
    food_sales_kobo: number
    formatted_food_sales: string
    delivery_fees_kobo: number
    formatted_delivery_fees: string
    service_charges_kobo: number
    formatted_service_charges: string
    subtotal_kobo: number
    formatted_subtotal: string
  }
  adjustments: {
    discounts_kobo: number
    formatted_discounts: string
    refunds_kobo: number
    formatted_refunds: string
    chargebacks_kobo: number
    formatted_chargebacks: string
    subtotal_kobo: number
    formatted_subtotal: string
  }
  commissions: {
    restaurant_commission_kobo: number
    formatted_restaurant_commission: string
    rider_commission_kobo: number
    formatted_rider_commission: string
    subtotal_kobo: number
    formatted_subtotal: string
  }
  net_revenue_kobo: number
  formatted_net_revenue: string
}

export type TotalRevenueCardData = {
  card: string
  period: {
    key: string
    from: string
    to: string
    previous_from?: string
    previous_to?: string
  }
  fulfillment_branch_id?: number | null
  headline: {
    label: string
    value: number
    value_kobo?: number | null
    formatted_value: string | number
    change_percent: number
    trend: DashboardTrend | string
  }
  summary: {
    total_revenue_kobo: number
    formatted_total_revenue: string
    total_revenue_change_percent?: number

    delivery_revenue_kobo: number
    formatted_delivery_revenue: string
    delivery_revenue_change_percent?: number

    order_revenue_kobo: number
    formatted_order_revenue: string
    order_revenue_change_percent?: number

    commission_revenue_kobo: number
    formatted_commission_revenue: string
    commission_revenue_change_percent?: number

    average_order_value_kobo: number
    formatted_average_order_value: string
    average_order_value_change_percent?: number

    revenue_per_user_kobo: number
    formatted_revenue_per_user: string
    revenue_per_user_change_percent?: number

    refund_amount_kobo: number
    formatted_refund_amount: string
    refund_amount_change_percent?: number

    net_revenue_kobo: number
    formatted_net_revenue: string
    net_revenue_change_percent?: number
  }
  revenue_trend: RevenueTrendPoint[]
  peak?: {
    label: string
    amount_kobo: number
    formatted_amount: string
  } | null
  payment_channels: PaymentChannelPerformanceItem[]
  operational_sales: OperationalSalesData
  category_performance: ProductCategoryPerformanceItem[]
  date_breakdown?: Record<string, unknown>
}

export type TotalRevenueCardResponse = {
  success: boolean
  data: TotalRevenueCardData
  message?: string
}

