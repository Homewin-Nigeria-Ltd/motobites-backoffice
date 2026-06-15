export type RevenueTrend = "up" | "down" | string

export type RevenuePeriod = {
  key: string
  from: string
  to: string
}

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

export type RevenueSalesGeneratedSeriesPoint = {
  month: string
  value_kobo: number
  formatted: string
  change_percent: number
}

export type RevenueSalesGenerated = {
  value_kobo: number
  formatted: string
  change_percent: number
  trend: RevenueTrend
  comparison_label: string
  series: RevenueSalesGeneratedSeriesPoint[]
}

export type RevenueTopKitchen = {
  serial: number
  kitchen_id: number
  name: string
  orders_count: number
  revenue_kobo: number
  formatted_revenue: string
  change_percent: number
  trend: RevenueTrend
  image_url?: string | null
}

export type RevenueTopSellingRestaurantSeriesPoint = {
  month: string
  orders: number
}

export type RevenueTopSellingRestaurant = {
  kitchen_id: number
  name: string
  change_percent: number
  trend: RevenueTrend
  series: RevenueTopSellingRestaurantSeriesPoint[]
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
  latitude: number
  longitude: number
  count: number
  percent: number
}

export type RevenueDeliveryLocations = {
  total_deliveries: number
  locations: RevenueDeliveryLocation[]
}

export type RevenueOrganicTrafficSeriesPoint = {
  month: string
  organic: number
  paid: number
  total: number
}

export type RevenueOrganicTraffic = {
  total: number
  organic: number
  paid: number
  per_month_label: string
  series: RevenueOrganicTrafficSeriesPoint[]
}

export type RevenueDeviceSalesChannel = {
  label: string
  sales: number
  total_kobo: number
}

export type RevenueDeviceSalesBrand = {
  brand: string
  key: string
  sales: number
  total_kobo: number
}

export type RevenueDeviceSales = {
  mobile: RevenueDeviceSalesChannel
  web_app: RevenueDeviceSalesChannel
  brands: RevenueDeviceSalesBrand[]
}

export type RevenueTopRider = {
  rider_id: number
  name: string
  initials: string
  deliveries: number
}

export type RevenueTopRiderPerformance = {
  total_deliveries: number
  riders: RevenueTopRider[]
}

export type RevenueCustomerGrowthArea = {
  key: string
  label: string
  sales: number
  revenue_kobo: number
  formatted_revenue: string
}

export type RevenueCustomerGrowthBubble = {
  key: string
  label: string
  value: number
  revenue_formatted: string
}

export type RevenueCustomerGrowthByArea = {
  total_sales: number
  areas: RevenueCustomerGrowthArea[]
  bubbles: RevenueCustomerGrowthBubble[]
}

export type RevenueMostSoldItem = {
  name: string
  sales: number
  revenue: number
  revenue_formatted: string
  change_percent: number
  trend: RevenueTrend
  gauge_percent: number
}

export type RevenueSalesByLocationEntry = {
  key: string
  label: string
  percent: number
  count: number
  value_kobo: number
  value_formatted: string
}

export type RevenueSalesByLocationQuarter = {
  quarter: string
  locations: RevenueSalesByLocationEntry[]
}

export type RevenueSalesByLocation = {
  total_sales: number
  quarters: RevenueSalesByLocationQuarter[]
}

export type RevenueSparklineSeriesPoint = {
  date: string
  value: number
}

export type RevenueSparklineMetric = {
  key: string
  label: string
  value: number
  change_percent: number
  trend: RevenueTrend
  series: RevenueSparklineSeriesPoint[]
}

export type RevenueAnalyticsData = {
  period: RevenuePeriod
  kpis: RevenueKpi[]
  sales_generated: RevenueSalesGenerated
  revenue_trend: RevenueTrendPoint[]
  top_kitchens: RevenueTopKitchen[]
  top_selling_restaurants: RevenueTopSellingRestaurant[]
  payment_methods: RevenuePaymentMethod[]
  customer_statistics: RevenueCustomerStatistic[]
  delivery_locations: RevenueDeliveryLocations
  organic_traffic: RevenueOrganicTraffic
  device_sales: RevenueDeviceSales
  top_rider_performance: RevenueTopRiderPerformance
  customer_growth_by_area: RevenueCustomerGrowthByArea
  most_sold_item: RevenueMostSoldItem
  sales_by_location: RevenueSalesByLocation
  sparkline_metrics: RevenueSparklineMetric[]
}

export type RevenueAnalyticsResponse = {
  success: boolean
  data: RevenueAnalyticsData
  message?: string
}
