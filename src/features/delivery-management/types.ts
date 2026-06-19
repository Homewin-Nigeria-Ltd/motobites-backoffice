export const deliveryTabs = [
  "all",
  "unassigned",
  "ongoing",
  "completed",
] as const

export type DeliveryTab = (typeof deliveryTabs)[number]

export const deliveryNavTabs = [...deliveryTabs, "riders"] as const

export type DeliveryNavTab = (typeof deliveryNavTabs)[number]

export type DeliverySummaryKpi = {
  key: string
  label: string
  formatted_value: string | number
  change_percent?: number
  trend?: "up" | "down" | string
}

export type DeliveryOrderFrequency = {
  total_orders: number
  series: Array<{ label?: string; value?: number }>
}

export type DeliveryZonePoint = {
  lat: number
  lng: number
}

export type DeliveryZoneStats = {
  order_count: number
  active_order_count: number
  completed_order_count: number
  unassigned_order_count: number
  rider_count: number
  coverage_status: "covered" | "uncovered" | "idle" | string
}

export type DeliveryZone = {
  id: number
  name: string
  code: string
  type: "polygon" | "radius" | string
  center: DeliveryZonePoint
  radius_km: number | null
  polygon: DeliveryZonePoint[] | null
  is_active: boolean
  stats: DeliveryZoneStats
  riders: unknown[]
}

export type DeliveryZoneOrder = {
  id: string
  lat: number
  lng: number
  status: string
  rider_id: number | null
  is_unassigned: boolean
  is_active_delivery: boolean
  zone_id: number | null
  zone_code: string | null
  zone_name: string | null
  covered: boolean
}

export type DeliveryZoneCoverageSummary = {
  active_zones: number
  orders_with_coordinates: number
  covered_orders: number
  uncovered_orders: number
  coverage_rate: number
  live_riders: number
  covered_riders: number
  uncovered_riders: number
  location_ttl_minutes: number
}

export type DeliveryZoneCoverage = {
  center: DeliveryZonePoint
  summary: DeliveryZoneCoverageSummary
  zones: DeliveryZone[]
  orders: DeliveryZoneOrder[]
  riders: unknown[]
  uncovered_orders: DeliveryZoneOrder[]
  uncovered_riders: unknown[]
}

export type DeliveryDashboardData = {
  summaryKpis: DeliverySummaryKpi[]
  orderFrequency: DeliveryOrderFrequency
  zoneCoverage: DeliveryZoneCoverage
}

export type ApiDeliverySummary = {
  ongoing_delivery: number
  total_delivery: number
  active_riders: number
  completed_delivery: number
  unassigned_delivery: number
}

export type ApiDeliveryOrderFrequencyPoint = {
  hour: string
  orders: number
}

export type ApiDeliveryZonePoint = {
  lat: number
  lng: number
}

export type ApiDeliveryZoneStats = {
  order_count: number
  active_order_count: number
  completed_order_count: number
  unassigned_order_count: number
  rider_count: number
  coverage_status: string
}

export type ApiDeliveryZone = {
  id: number
  name: string
  code: string
  type: string
  center: ApiDeliveryZonePoint
  radius_km: number | null
  polygon: ApiDeliveryZonePoint[] | null
  is_active: boolean
  stats: ApiDeliveryZoneStats
  riders: unknown[]
}

export type ApiDeliveryZoneOrder = {
  id: string
  lat: number | string
  lng: number | string
  status: string
  rider_id: number | null
  is_unassigned: boolean
  is_active_delivery: boolean
  zone_id: number | null
  zone_code: string | null
  zone_name: string | null
  covered: boolean
}

export type ApiDeliveryZoneCoverageSummary = {
  active_zones: number
  orders_with_coordinates: number
  covered_orders: number
  uncovered_orders: number
  coverage_rate: number
  live_riders: number
  covered_riders: number
  uncovered_riders: number
  location_ttl_minutes: number
}

export type ApiDeliveryZoneCoverage = {
  center: ApiDeliveryZonePoint
  summary: ApiDeliveryZoneCoverageSummary
  zones: ApiDeliveryZone[]
  orders: ApiDeliveryZoneOrder[]
  riders: unknown[]
  uncovered_orders: ApiDeliveryZoneOrder[]
  uncovered_riders: unknown[]
}

export type ApiDeliveryDashboardData = {
  summary: ApiDeliverySummary
  order_frequency: ApiDeliveryOrderFrequencyPoint[]
  delivery_zone_coverage: ApiDeliveryZoneCoverage
}

export type DeliveryDashboardResponse = {
  data: ApiDeliveryDashboardData
}

export function isDeliveryTab(value: string): value is DeliveryTab {
  return (deliveryTabs as readonly string[]).includes(value)
}

export function getDeliveryTabPath(tab: DeliveryTab) {
  return `/delivery/${tab}`
}

export function getDeliveryNavTabPath(tab: DeliveryNavTab) {
  if (tab === "riders") {
    return "/riders"
  }

  return getDeliveryTabPath(tab)
}

export function isDeliveryNavTab(value: string): value is DeliveryNavTab {
  return (deliveryNavTabs as readonly string[]).includes(value)
}
