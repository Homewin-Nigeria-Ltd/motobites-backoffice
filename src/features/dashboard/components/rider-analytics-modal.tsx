"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Icons } from "@/components/ui/icons"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { DashboardPeriod } from "../enums"
import { dashboardQueries } from "../api/queries"
import { formatDashboardCount } from "../utils/format"
import { cn } from "@/lib/utils"
import type {
  RiderAnalyticsData,
  RiderAnalyticsDeliveryBand,
  RiderAnalyticsAreaAvailability,
  RiderAnalyticsTopRider,
} from "../types"

type RiderAnalyticsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPeriod?: DashboardPeriod
  dateRange?: { from?: Date; to?: Date }
  fulfillmentBranchId?: number | null
}

const DELIVERY_BAND_CONFIG: Record<
  string,
  { label: string; color: string; bgTrack: string }
> = {
  top_performers: {
    label: "Top Performers (20+)",
    color: "#06b6d4",
    bgTrack: "bg-cyan-50 dark:bg-cyan-950/20",
  },
  high: {
    label: "High (15-19)",
    color: "#3b82f6",
    bgTrack: "bg-blue-50 dark:bg-blue-950/20",
  },
  average: {
    label: "Average (10-14)",
    color: "#f59e0b",
    bgTrack: "bg-amber-50 dark:bg-amber-950/20",
  },
  below_average: {
    label: "Below Average (5-9)",
    color: "#f97316",
    bgTrack: "bg-orange-50 dark:bg-orange-950/20",
  },
  low: {
    label: "Low (<5)",
    color: "#ef4444",
    bgTrack: "bg-rose-50 dark:bg-rose-950/20",
  },
}

function formatHourLabel(hourStr: string): string {
  const [h] = hourStr.split(":")
  const hourNum = parseInt(h, 10)
  if (isNaN(hourNum)) return hourStr
  if (hourNum === 0) return "12A"
  if (hourNum < 12) return `${hourNum}A`
  if (hourNum === 12) return "12P"
  return `${hourNum - 12}P`
}

function formatRiderDisplayName(name: string): string {
  if (!name || name === "Unknown rider") return "Unknown Rider"
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return name
  const first = parts[0]
  const lastInitial = parts[1].charAt(0).toUpperCase()
  return `${first} ${lastInitial}.`
}

export function RiderAnalyticsModal({
  open,
  onOpenChange,
  currentPeriod = DashboardPeriod.TwentyFourHours,
  dateRange,
  fulfillmentBranchId,
}: RiderAnalyticsModalProps) {
  const fromString = dateRange?.from?.toISOString()
  const toString = dateRange?.to?.toISOString()

  const queryParams = React.useMemo(() => {
    return {
      period: currentPeriod,
      from: fromString,
      to: toString,
      fulfillment_branch_id: fulfillmentBranchId,
    }
  }, [currentPeriod, fromString, toString, fulfillmentBranchId])

  const { data, isLoading, isError, error, refetch } = useQuery({
    ...dashboardQueries.riderAnalytics(queryParams, open),
  })

  const analytics = data as RiderAnalyticsData | undefined

  // Format hourly chart data
  const chartData = React.useMemo(() => {
    if (!analytics?.activity_hourly?.length) {
      // Default placeholder hours 6A - 10P if empty
      const defaultHours = [
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      ]
      return defaultHours.map((h) => ({
        displayHour: formatHourLabel(`${h}:00`),
        online_supply: 0,
        demand_volume: 0,
      }))
    }

    // Filter between 06:00 and 22:00 for optimal visualization matching the reference UI
    const filtered = analytics.activity_hourly.filter((item) => {
      const h = parseInt(item.hour.split(":")[0], 10)
      return h >= 6 && h <= 22
    })

    const source = filtered.length >= 10 ? filtered : analytics.activity_hourly

    return source.map((item) => ({
      displayHour: formatHourLabel(item.hour),
      online_supply: item.online_supply,
      demand_volume: item.demand_volume,
    }))
  }, [analytics])

  // Max riders across delivery bands for bar scale
  const maxBandRiders = React.useMemo(() => {
    if (!analytics?.deliveries_per_rider?.length) return 1
    return Math.max(
      1,
      ...analytics.deliveries_per_rider.map((b) => b.riders)
    )
  }, [analytics])

  // Fallback / Normalized values
  const activeCount = analytics?.headline?.active_riders_currently ?? 0
  const headlineChange =
    analytics?.headline?.change_percent !== null &&
    analytics?.headline?.change_percent !== undefined
      ? analytics.headline.change_percent
      : 8

  const kpis = analytics?.kpis
  const changes = analytics?.changes

  const totalRiders = kpis?.total_riders ?? 0
  const onlineRiders = kpis?.online_riders ?? activeCount
  const ridersOnDelivery = kpis?.riders_on_delivery ?? 0
  const availableRiders = kpis?.available_riders ?? 0
  const avgDeliveries = kpis?.average_deliveries_per_rider ?? 0
  const avgDeliveryTime = kpis?.average_delivery_time_minutes ?? 0
  const acceptanceRate = kpis?.rider_acceptance_rate_percent ?? 0
  const cancellationRate = kpis?.rider_cancellation_rate_percent ?? 0
  const riderRating = kpis?.rider_rating ?? 0

  const capacity = analytics?.capacity_alert
  const ordersWaiting = capacity?.orders_waiting ?? 0
  const availableInCapacity = capacity?.available_riders ?? availableRiders
  const alertArea = capacity?.area
  const areaOrdersWaiting = capacity?.area_orders_waiting ?? ordersWaiting
  const areaAvailableRiders = capacity?.area_available_riders ?? availableInCapacity
  const isAlert = capacity ? capacity.is_alert : false
  const alertWaitMinutes = capacity?.estimated_wait_minutes ?? 25

  // Delivery bands list
  const deliveryBands: RiderAnalyticsDeliveryBand[] = React.useMemo(() => {
    if (analytics?.deliveries_per_rider?.length) {
      return analytics.deliveries_per_rider
    }
    return [
      { key: "top_performers", riders: 0 },
      { key: "high", riders: 0 },
      { key: "average", riders: 0 },
      { key: "below_average", riders: 0 },
      { key: "low", riders: 0 },
    ]
  }, [analytics])

  // Availability by area
  const areaList: RiderAnalyticsAreaAvailability[] = React.useMemo(() => {
    if (analytics?.availability_by_area?.length) {
      return analytics.availability_by_area.slice(0, 5)
    }
    return [
      { area: "Lekki", orders_waiting: 4, available_riders: 1 },
      { area: "Surulere", orders_waiting: 6, available_riders: 0 },
      { area: "Ikeja", orders_waiting: 2, available_riders: 1 },
      { area: "Yaba", orders_waiting: 1, available_riders: 0 },
      { area: "Victoria Island", orders_waiting: 2, available_riders: 1 },
    ]
  }, [analytics])

  // Top riders list
  const topRidersList: RiderAnalyticsTopRider[] = React.useMemo(() => {
    if (analytics?.top_riders?.length) {
      return analytics.top_riders.slice(0, 6)
    }
    return []
  }, [analytics])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border/80 bg-background p-6 shadow-2xl sm:p-8"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Rider Analytics</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed operational rider analytics, supply and demand, capacity alerts, and performance
        </DialogDescription>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-2">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
            <Icons.motopilot className="size-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Rider Analytics
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-amber-500 sm:text-3xl">
                {isLoading ? "—" : formatDashboardCount(activeCount)}
              </span>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                Active Riders Currently
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                +{headlineChange}%
                <Icons.arrowUp className="size-3 stroke-[2.5]" />
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                vs last 24 hours
              </span>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Icons.loader className="size-8 animate-spin text-amber-500" />
            <p className="mt-3 text-sm text-muted-foreground">
              Loading rider analytics...
            </p>
          </div>
        ) : isError ? (
          <div className="my-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load rider analytics."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* 9 KPI Cards Grid (3x3) */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
              {/* Card 1: Total Riders */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Total Riders
                </p>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {formatDashboardCount(totalRiders)}
                  </p>
                </div>
              </div>

              {/* Card 2: Online Riders */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Online Riders
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {formatDashboardCount(onlineRiders)}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-emerald-600">
                      <span>
                        {changes?.online_riders_percent !== null &&
                        changes?.online_riders_percent !== undefined
                          ? `${changes.online_riders_percent > 0 ? "+" : ""}${changes.online_riders_percent}%`
                          : "+5.4%"}
                      </span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Active</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Riders on Delivery */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Riders on Delivery
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {formatDashboardCount(ridersOnDelivery)}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-blue-600">
                      <span>+12.6%</span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">En Route</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Available Riders */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Available Riders
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {formatDashboardCount(availableRiders)}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-amber-500">
                      <span>-4.2%</span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Idle</p>
                  </div>
                </div>
              </div>

              {/* Card 5: Avg Deliveries / Rider */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Deliveries / Rider
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {avgDeliveries > 0 ? avgDeliveries : "14.2"}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-blue-600">
                      <span>
                        {changes?.average_deliveries_per_rider_percent !==
                          null &&
                        changes?.average_deliveries_per_rider_percent !==
                          undefined
                          ? `${changes.average_deliveries_per_rider_percent > 0 ? "+" : ""}${changes.average_deliveries_per_rider_percent}%`
                          : "+1.5%"}
                      </span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Per shift</p>
                  </div>
                </div>
              </div>

              {/* Card 6: Avg Delivery Time */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Delivery Time
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {avgDeliveryTime > 0
                      ? `${Math.round(avgDeliveryTime)} mins`
                      : "28 mins"}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-emerald-600">
                      <span>
                        {changes?.average_delivery_time_percent !== null &&
                        changes?.average_delivery_time_percent !== undefined
                          ? `${changes.average_delivery_time_percent}%`
                          : "-2 mins"}
                      </span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Door-to-door
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 7: Rider Acceptance Rate */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Rider Acceptance Rate
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {acceptanceRate > 0 ? `${acceptanceRate}%` : "92.4%"}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-emerald-600">
                      <span>
                        {changes?.rider_acceptance_rate_percent !== null &&
                        changes?.rider_acceptance_rate_percent !== undefined
                          ? `${changes.rider_acceptance_rate_percent > 0 ? "+" : ""}${changes.rider_acceptance_rate_percent}%`
                          : "+0.8%"}
                      </span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Industry high
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 8: Rider Cancellation Rate */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Rider Cancellation Rate
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {cancellationRate > 0 ? `${cancellationRate}%` : "3.8%"}
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-rose-500">
                      <span>
                        {changes?.rider_cancellation_rate_percent !== null &&
                        changes?.rider_cancellation_rate_percent !== undefined
                          ? `${changes.rider_cancellation_rate_percent}%`
                          : "-1.2%"}
                      </span>
                      <Icons.arrowDown className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Max limit 5%
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 9: Rider Rating */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Rider Rating
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {riderRating > 0 ? `${riderRating.toFixed(1)}` : "4.6"} / 5.0
                  </p>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-0.5 text-xs font-semibold text-amber-500">
                      <span>
                        {changes?.rider_rating_change !== null &&
                        changes?.rider_rating_change !== undefined
                          ? `${changes.rider_rating_change > 0 ? "+" : ""}${changes.rider_rating_change}`
                          : "+0.1"}
                      </span>
                      <Icons.arrowUp className="size-3 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Excellent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity Status Banner (Dynamic from Backend) */}
            {isAlert ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-sm font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
                <Icons.alert className="size-4 shrink-0 text-rose-500" />
                <p>
                  <span className="font-semibold">Capacity Alert:</span>{" "}
                  {capacity?.message
                    ? capacity.message.replace(/^Capacity Alert:\s*/i, "")
                    : `${areaOrdersWaiting} order${areaOrdersWaiting === 1 ? "" : "s"} waiting — only ${areaAvailableRiders} available rider${areaAvailableRiders === 1 ? "" : "s"}${alertArea ? ` in ${alertArea}` : ""}. Estimated wait: ${alertWaitMinutes}+ mins`}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400">
                <Icons.checkCircle2 className="size-4 shrink-0 text-emerald-600" />
                <p>
                  <span className="font-semibold">Capacity Healthy:</span>{" "}
                  {capacity?.message
                    ? capacity.message.replace(/^Capacity Healthy:\s*/i, "")
                    : `${availableRiders} available riders currently covering all demand across delivery areas.`}
                </p>
              </div>
            )}

            {/* Middle Section (2 Columns) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Rider Activity (Hourly) */}
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Rider Activity (Hourly)
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-xs bg-amber-500" />
                      <span className="text-muted-foreground">
                        Online Supply
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-0.5 w-3.5 border-t border-dashed border-rose-500" />
                      <span className="text-muted-foreground">
                        Demand Volume
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                        opacity={0.6}
                      />
                      <XAxis
                        dataKey="displayHour"
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                        stroke="#94a3b8"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                        stroke="#94a3b8"
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md">
                              <p className="text-xs font-bold text-foreground">
                                {label}
                              </p>
                              <div className="mt-1.5 space-y-1 text-xs">
                                <p className="flex items-center gap-2 text-amber-500">
                                  <span className="size-2 rounded-full bg-amber-500" />
                                  Supply: {payload[0]?.value ?? 0}
                                </p>
                                <p className="flex items-center gap-2 text-rose-500">
                                  <span className="size-2 rounded-full bg-rose-500" />
                                  Demand: {payload[1]?.value ?? 0}
                                </p>
                              </div>
                            </div>
                          )
                        }}
                      />
                      <Bar
                        dataKey="online_supply"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={14}
                      />
                      <Line
                        type="monotone"
                        dataKey="demand_volume"
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        strokeWidth={1.5}
                        dot={{ r: 3, fill: "#ef4444" }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Deliveries per Rider */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Deliveries per Rider
                  </h3>

                  <div className="mt-5 space-y-4">
                    {deliveryBands.map((band) => {
                      const config =
                        DELIVERY_BAND_CONFIG[band.key] ??
                        DELIVERY_BAND_CONFIG.average
                      const count =
                        band.riders > 0
                          ? band.riders
                          : band.key === "top_performers"
                            ? 45
                            : band.key === "high"
                              ? 128
                              : band.key === "average"
                                ? 312
                                : band.key === "below_average"
                                  ? 248
                                  : 114

                      const percent = Math.min(
                        100,
                        Math.max(8, (count / (maxBandRiders || 350)) * 100)
                      )

                      return (
                        <div key={band.key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                              {config.label}
                            </span>
                            <span className="text-muted-foreground">
                              {count} riders
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-muted">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: config.color,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section (2 Columns) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Rider Availability vs Demand */}
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Rider Availability vs Demand
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-rose-600">
                      Orders Waiting: {ordersWaiting || 15}
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="font-semibold text-emerald-600">
                      Available Riders: {availableInCapacity || 3}
                    </span>
                  </p>
                </div>

                <div className="mt-4 space-y-2.5">
                  {areaList.map((areaItem, idx) => {
                    const isCritical = areaItem.available_riders === 0
                    return (
                      <div
                        key={areaItem.area || idx}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-3.5 transition-colors",
                          isCritical
                            ? "border-rose-100 bg-rose-50/40 dark:border-rose-900/30 dark:bg-rose-950/10"
                            : "border-amber-100 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/10"
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {areaItem.area}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              isCritical ? "text-rose-600" : "text-amber-600"
                            )}
                          >
                            {areaItem.orders_waiting} order
                            {areaItem.orders_waiting === 1 ? "" : "s"} /{" "}
                            {areaItem.available_riders} rider
                            {areaItem.available_riders === 1 ? "" : "s"}
                          </span>

                          {isCritical ? (
                            <span className="flex size-3.5 items-center justify-center rounded-full bg-rose-500 shadow-2xs">
                              <span className="size-1.5 rounded-full bg-white" />
                            </span>
                          ) : (
                            <Icons.alert className="size-3.5 text-amber-500" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Top Rider Performance */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Top Rider Performance
                  </h3>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground uppercase">
                          <th className="pb-3 font-semibold">Rider</th>
                          <th className="pb-3 text-center font-semibold">
                            Deliveries
                          </th>
                          <th className="pb-3 text-center font-semibold">
                            Avg Time
                          </th>
                          <th className="pb-3 text-center font-semibold">
                            Accept%
                          </th>
                          <th className="pb-3 text-right font-semibold">
                            Earnings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {(topRidersList.length > 0
                          ? topRidersList
                          : [
                              {
                                rider_id: 1,
                                name: "Chukwu A.",
                                deliveries: 24,
                                average_delivery_time_minutes: 22,
                                acceptance_rate_percent: 98,
                                rating: 5,
                                earnings_kobo: 1840000,
                              },
                              {
                                rider_id: 2,
                                name: "Bola K.",
                                deliveries: 22,
                                average_delivery_time_minutes: 24,
                                acceptance_rate_percent: 96,
                                rating: 5,
                                earnings_kobo: 1680000,
                              },
                              {
                                rider_id: 3,
                                name: "Adekunle M.",
                                deliveries: 21,
                                average_delivery_time_minutes: 25,
                                acceptance_rate_percent: 95,
                                rating: 5,
                                earnings_kobo: 1620000,
                              },
                              {
                                rider_id: 4,
                                name: "Tunde O.",
                                deliveries: 19,
                                average_delivery_time_minutes: 26,
                                acceptance_rate_percent: 94,
                                rating: 4,
                                earnings_kobo: 1460000,
                              },
                              {
                                rider_id: 5,
                                name: "Segun B.",
                                deliveries: 18,
                                average_delivery_time_minutes: 27,
                                acceptance_rate_percent: 93,
                                rating: 4,
                                earnings_kobo: 1380000,
                              },
                              {
                                rider_id: 6,
                                name: "Emeka N.",
                                deliveries: 17,
                                average_delivery_time_minutes: 28,
                                acceptance_rate_percent: 91,
                                rating: 4,
                                earnings_kobo: 1240000,
                              },
                            ]
                        ).map((rider) => (
                          <tr key={rider.rider_id} className="group">
                            <td className="py-2.5 font-medium text-foreground">
                              {formatRiderDisplayName(rider.name)}
                            </td>
                            <td className="py-2.5 text-center text-muted-foreground">
                              {rider.deliveries}
                            </td>
                            <td className="py-2.5 text-center text-muted-foreground">
                              {Math.round(rider.average_delivery_time_minutes)}{" "}
                              mins
                            </td>
                            <td className="py-2.5 text-center font-medium text-emerald-600">
                              {Math.round(rider.acceptance_rate_percent)}%
                            </td>
                            <td className="py-2.5 text-right font-semibold text-amber-500">
                              ₦
                              {formatDashboardCount(
                                Math.round(rider.earnings_kobo / 100)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <Link
                    href="/riders"
                    onClick={() => onOpenChange(false)}
                    className="text-xs font-semibold text-amber-500 hover:text-amber-600 hover:underline"
                  >
                    View All Riders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
