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
  revenue: number
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

export type DashboardOverviewData = {
  period: {
    key: string
    from: string
    to: string
    previous_from?: string
    previous_to?: string
  }
  kpis: DashboardKpi[]
  order_frequency: {
    total_orders: number
    change_percent: number
    trend: DashboardTrend | string
    series: DashboardSeriesPoint[]
  }
  top_motopilots: {
    total_rides: number
    riders: DashboardMotopilotRider[]
  }
  sales_revenue: {
    total_kobo: number
    formatted_total: string
    series: DashboardSalesRevenuePoint[]
  }
  daily_traffic: {
    new_users: number
    change_percent: number
    trend: DashboardTrend | string
    series: DashboardSeriesPoint[]
  }
  inventory_status: {
    source?: string
    items: DashboardInventoryItem[]
  }
  top_selling: {
    combos: DashboardTopSellingEntry[]
    items: DashboardTopSellingEntry[]
    kitchens: DashboardTopSellingEntry[]
  }
  performance_metrics: DashboardPerformanceMetric[]
}

export type DashboardOverviewResponse = {
  success: boolean
  data: DashboardOverviewData
  message?: string
}
