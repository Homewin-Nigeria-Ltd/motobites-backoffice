import type {
  ApiDeliveryDashboardData,
  ApiDeliveryOrderFrequencyPoint,
  ApiDeliveryZone,
  ApiDeliveryZoneCoverage,
  DeliveryDashboardData,
  DeliveryOrderFrequency,
  DeliverySummaryKpi,
  DeliveryZone,
  DeliveryZoneCoverage,
} from "../types"
import { formatOrderFrequencyHour } from "./format"

const SUMMARY_CARDS: Array<{
  key: keyof ApiDeliveryDashboardData["summary"]
  label: string
}> = [
  { key: "ongoing_delivery", label: "Ongoing Delivery" },
  { key: "total_delivery", label: "Total Delivery" },
  { key: "active_riders", label: "Active Riders" },
]

const DEFAULT_ZONE_CENTER = { lat: 6.5244, lng: 3.3792 }

const DEFAULT_ZONE_SUMMARY: DeliveryZoneCoverage["summary"] = {
  active_zones: 0,
  orders_with_coordinates: 0,
  covered_orders: 0,
  uncovered_orders: 0,
  coverage_rate: 0,
  live_riders: 0,
  covered_riders: 0,
  uncovered_riders: 0,
  location_ttl_minutes: 0,
}

function mapSummaryKpis(
  summary: ApiDeliveryDashboardData["summary"]
): DeliverySummaryKpi[] {
  return SUMMARY_CARDS.map(({ key, label }) => ({
    key,
    label,
    formatted_value: summary[key],
  }))
}

function mapOrderFrequency(
  points: ApiDeliveryOrderFrequencyPoint[]
): DeliveryOrderFrequency {
  const series = points.map((point) => ({
    label: formatOrderFrequencyHour(point.hour),
    value: point.orders,
  }))

  const total_orders = points.reduce((sum, point) => sum + point.orders, 0)

  return {
    total_orders,
    series,
  }
}

function toCoordinate(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return NaN
  }

  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function mapZonePoint(point: { lat: number | string; lng: number | string }) {
  return {
    lat: toCoordinate(point.lat),
    lng: toCoordinate(point.lng),
  }
}

function mapZone(zone: ApiDeliveryZone): DeliveryZone {
  return {
    id: zone.id,
    name: zone.name,
    code: zone.code,
    type: zone.type,
    center: mapZonePoint(zone.center),
    radius_km: zone.radius_km,
    polygon: zone.polygon?.map(mapZonePoint) ?? null,
    is_active: zone.is_active,
    stats: zone.stats,
    riders: zone.riders,
  }
}

function mapZoneCoverage(
  coverage?: ApiDeliveryZoneCoverage | null
): DeliveryZoneCoverage {
  if (!coverage) {
    return {
      center: DEFAULT_ZONE_CENTER,
      summary: DEFAULT_ZONE_SUMMARY,
      zones: [],
      orders: [],
      riders: [],
      uncovered_orders: [],
      uncovered_riders: [],
    }
  }

  return {
    center: coverage.center
      ? mapZonePoint(coverage.center)
      : DEFAULT_ZONE_CENTER,
    summary: coverage.summary ?? DEFAULT_ZONE_SUMMARY,
    zones: coverage.zones?.map(mapZone) ?? [],
    orders: [],
    riders: coverage.riders ?? [],
    uncovered_orders: [],
    uncovered_riders: coverage.uncovered_riders ?? [],
  }
}

export function mapDeliveryDashboard(
  data: ApiDeliveryDashboardData
): DeliveryDashboardData {
  return {
    summaryKpis: mapSummaryKpis(data.summary),
    orderFrequency: mapOrderFrequency(data.order_frequency ?? []),
    zoneCoverage: mapZoneCoverage(data.delivery_zone_coverage),
  }
}
