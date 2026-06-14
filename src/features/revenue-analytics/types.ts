export type RevenueTrend = "up" | "down" | string

export type RevenueKpi = {
  key: string
  label: string
  value?: number
  value_kobo?: number
  formatted_value: string | number
  change_percent: number
  trend: RevenueTrend
}

export type RevenueTrendPoint = {
  month: string
  current_kobo: number
  previous_year_kobo: number
}

export type RevenueTopKitchen = {
  serial?: number
  kitchen_id?: number
  name: string
  orders_count?: number
  total_orders?: number
  amount_kobo?: number
  formatted_amount?: string
  image_url?: string | null
}

export type RevenuePaymentMethod = {
  channel: string
  label: string
  total_kobo: number
  percent: number
}

export type RevenueCustomerStatistic = {
  month: string
  new_customers: number
  returning_customers: number
}

export type RevenueDeliveryLocation = {
  key: string
  label: string
  count: number
  percent: number
}

export type RevenueAnalyticsData = {
  period: {
    key: string
    from: string
    to: string
  }
  kpis: RevenueKpi[]
  sales_generated: {
    value_kobo: number
    formatted: string
    change_percent: number
    trend: RevenueTrend
    comparison_label: string
    series: {
      month: string
      value_kobo: number
      formatted: string
      change_percent: number
    }[]
  }
  revenue_trend: RevenueTrendPoint[]
  top_kitchens: RevenueTopKitchen[]
  top_selling_restaurants: RevenueTopKitchen[]
  payment_methods: RevenuePaymentMethod[]
  customer_statistics: RevenueCustomerStatistic[]
  delivery_locations: {
    total_deliveries: number
    locations: RevenueDeliveryLocation[]
  }
}

export type RevenueAnalyticsResponse = {
  success: boolean
  data: {
    analytics: RevenueAnalyticsData
  }
  message?: string
}
