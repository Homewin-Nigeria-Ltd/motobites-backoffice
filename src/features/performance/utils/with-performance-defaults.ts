import type { RevenueAnalyticsData } from "@/features/revenue-analytics/types"

const emptyPerformanceFields = {
  sales_generated: {
    value_kobo: 0,
    formatted: "₦0",
    change_percent: 0,
    trend: "up" as const,
    comparison_label: "vs last period",
    series: [],
  },
  top_selling_restaurants: [],
  organic_traffic: {
    total: 0,
    organic: 0,
    paid: 0,
    per_month_label: "Per month",
    series: [],
  },
  device_sales: {
    mobile: { label: "Mobile", sales: 0, total_kobo: 0 },
    web_app: { label: "Web App", sales: 0, total_kobo: 0 },
    brands: [],
  },
  top_rider_performance: {
    total_deliveries: 0,
    riders: [],
  },
  customer_growth_by_area: {
    total_sales: 0,
    areas: [],
    bubbles: [],
  },
  most_sold_item: {
    name: "—",
    sales: 0,
    revenue: 0,
    revenue_formatted: "₦0",
    change_percent: 0,
    trend: "up" as const,
    gauge_percent: 0,
  },
  sales_by_location: {
    total_sales: 0,
    quarters: [],
  },
  sparkline_metrics: [],
}

export function withPerformanceDefaults(
  data: RevenueAnalyticsData,
): RevenueAnalyticsData {
  return {
    ...data,
    sales_generated:
      data.sales_generated ?? emptyPerformanceFields.sales_generated,
    top_selling_restaurants:
      data.top_selling_restaurants ??
      emptyPerformanceFields.top_selling_restaurants,
    organic_traffic:
      data.organic_traffic ?? emptyPerformanceFields.organic_traffic,
    device_sales: data.device_sales ?? emptyPerformanceFields.device_sales,
    top_rider_performance:
      data.top_rider_performance ??
      emptyPerformanceFields.top_rider_performance,
    customer_growth_by_area:
      data.customer_growth_by_area ??
      emptyPerformanceFields.customer_growth_by_area,
    most_sold_item: data.most_sold_item ?? emptyPerformanceFields.most_sold_item,
    sales_by_location:
      data.sales_by_location ?? emptyPerformanceFields.sales_by_location,
    sparkline_metrics:
      data.sparkline_metrics ?? emptyPerformanceFields.sparkline_metrics,
  }
}
