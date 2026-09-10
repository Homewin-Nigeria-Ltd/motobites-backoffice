"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DashboardPeriod } from "../enums"
import { dashboardQueries } from "../api/queries"
import { formatCompactCount, formatDashboardCount } from "../utils/format"
import { cn } from "@/lib/utils"

type TotalDeliveriesModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPeriod?: DashboardPeriod
  dateRange?: { from?: Date; to?: Date }
  fulfillmentBranchId?: number | null
}

type TrendInterval = "hourly" | "daily" | "weekly" | "monthly"

const STATUS_COLORS: Record<string, string> = {
  completed: "#22c55e",
  in_progress: "#2563eb",
  failed: "#ef4444",
  cancelled: "#f59e0b",
}

function mapIntervalToPeriod(interval: TrendInterval): DashboardPeriod {
  switch (interval) {
    case "hourly":
      return DashboardPeriod.TwentyFourHours
    case "daily":
      return DashboardPeriod.Week
    case "weekly":
      return DashboardPeriod.ThreeMonths
    case "monthly":
      return DashboardPeriod.Year
  }
}

function mapPeriodToInterval(period: DashboardPeriod): TrendInterval {
  switch (period) {
    case DashboardPeriod.TwentyFourHours:
      return "hourly"
    case DashboardPeriod.Week:
      return "daily"
    case DashboardPeriod.ThreeMonths:
      return "weekly"
    case DashboardPeriod.Year:
      return "monthly"
  }
}

function formatChangePercent(val?: number | null) {
  if (val === undefined || val === null) {
    return null
  }
  return `${val > 0 ? "+" : ""}${val}%`
}

export function TotalDeliveriesModal({
  open,
  onOpenChange,
  currentPeriod = DashboardPeriod.TwentyFourHours,
  dateRange,
}: TotalDeliveriesModalProps) {
  const [selectedInterval, setSelectedInterval] =
    React.useState<TrendInterval>(() => mapPeriodToInterval(currentPeriod))

  // Update selected interval when modal is opened with a different dashboard period
  React.useEffect(() => {
    if (open) {
      setSelectedInterval(mapPeriodToInterval(currentPeriod))
    }
  }, [open, currentPeriod])

  const fromString = dateRange?.from?.toISOString()
  const toString = dateRange?.to?.toISOString()

  // Main query using active dashboard period
  const queryParams = React.useMemo(() => {
    return {
      period: currentPeriod,
      from: fromString,
      to: toString,
    }
  }, [currentPeriod, fromString, toString])

  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    dashboardQueries.cardDetails("total_deliveries", queryParams, open)
  )

  // Secondary query if user switches trend tabs specifically
  const isCustomTrend = selectedInterval !== mapPeriodToInterval(currentPeriod)
  const trendQueryParams = React.useMemo(() => {
    return {
      period: mapIntervalToPeriod(selectedInterval),
    }
  }, [selectedInterval])

  const { data: trendData, isLoading: isTrendLoading } = useQuery(
    dashboardQueries.cardDetails(
      "total_deliveries",
      trendQueryParams,
      open && isCustomTrend
    )
  )

  const summary = apiData?.summary
  const headline = apiData?.headline
  const performance = apiData?.performance
  const locations = apiData?.by_location ?? []
  const statusBreakdown = apiData?.status_breakdown ?? []

  const trendSeries = isCustomTrend
    ? (trendData?.trend ?? [])
    : (apiData?.trend ?? [])

  const maxLocationDeliveries = React.useMemo(() => {
    return locations.length > 0
      ? Math.max(...locations.map((loc) => loc.deliveries), 1)
      : 1
  }, [locations])

  const totalDeliveriesCount =
    summary?.total_deliveries ?? headline?.value ?? 0

  const periodSubtitle = React.useMemo(() => {
    switch (currentPeriod) {
      case DashboardPeriod.TwentyFourHours:
        return "vs last 24 hours"
      case DashboardPeriod.Week:
        return "vs previous week"
      case DashboardPeriod.ThreeMonths:
        return "vs previous 3 months"
      case DashboardPeriod.Year:
        return "vs previous year"
      default:
        return "vs previous period"
    }
  }, [currentPeriod])

  const maxPerformanceTime = React.useMemo(() => {
    return Math.max(
      performance?.average_order_to_door_minutes ?? 0,
      performance?.average_rider_travel_minutes ?? 0,
      performance?.average_prep_time_minutes ?? 0,
      performance?.average_rider_pickup_minutes ?? 0,
      1
    )
  }, [performance])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto p-0 border-border bg-background rounded-3xl gap-0 shadow-2xl"
      >
        <DialogTitle className="sr-only">Total Delivery Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed metrics and operational trends for deliveries
        </DialogDescription>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Delivery Box Badge */}
              <div className="size-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Total Delivery Details
                </h2>

                {isLoading ? (
                  <div className="mt-2 h-7 w-48 rounded-md bg-muted animate-pulse" />
                ) : !isError && apiData ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2.5">
                    <span className="text-3xl font-extrabold tracking-tight text-foreground">
                      {formatDashboardCount(totalDeliveriesCount)}
                    </span>
                    {headline?.change_percent !== undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                          headline.trend === "down"
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        <span className="text-[10px]">
                          {headline.trend === "down" ? "↓" : "↑"}
                        </span>{" "}
                        {formatChangePercent(headline.change_percent)}
                      </span>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">
                      {periodSubtitle}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Custom Circular Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="size-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shadow-xs"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-6 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl border border-border/80 bg-muted/40 animate-pulse p-4"
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="h-64 rounded-2xl border border-border/80 bg-muted/40 animate-pulse" />
                <div className="h-64 rounded-2xl border border-border/80 bg-muted/40 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="h-56 rounded-2xl border border-border/80 bg-muted/40 animate-pulse" />
                <div className="h-56 rounded-2xl border border-border/80 bg-muted/40 animate-pulse" />
              </div>
            </div>
          ) : isError || !apiData ? (
            /* Error State */
            <div className="my-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Unable to load delivery details
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {error instanceof Error
                    ? error.message
                    : "Could not retrieve total delivery analytics for the selected period."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Retry
              </Button>
            </div>
          ) : (
            /* Actual Data Content */
            <>
              {/* 8 Metric Cards (4x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Card 1: Total Deliveries */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Total Deliveries
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {formatDashboardCount(summary?.total_deliveries ?? 0)}
                    </span>
                    {summary?.total_deliveries_change_percent !== undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.total_deliveries_change_percent ?? 0) < 0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.total_deliveries_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 2: Completed Deliveries */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Completed Deliveries
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {formatDashboardCount(summary?.completed_deliveries ?? 0)}
                    </span>
                    {summary?.completed_deliveries_change_percent !==
                      undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.completed_deliveries_change_percent ?? 0) < 0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.completed_deliveries_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 3: Failed Deliveries */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Failed Deliveries
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {formatDashboardCount(summary?.failed_deliveries ?? 0)}
                    </span>
                    {summary?.failed_deliveries_change_percent !== undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.failed_deliveries_change_percent ?? 0) > 0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.failed_deliveries_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 4: Cancelled Deliveries */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Cancelled Deliveries
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {formatDashboardCount(summary?.cancelled_deliveries ?? 0)}
                    </span>
                    {summary?.cancelled_deliveries_change_percent !==
                      undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.cancelled_deliveries_change_percent ?? 0) > 0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.cancelled_deliveries_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 5: Average Delivery Time */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Average Delivery Time
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {summary?.average_delivery_time_minutes ?? 0} mins
                    </span>
                    {summary?.average_delivery_time_change_percent !==
                      undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.average_delivery_time_change_percent ?? 0) > 0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.average_delivery_time_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card 6: On-Time Delivery % */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    On-Time Delivery %
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {summary?.on_time_delivery_percent ?? 0}%
                    </span>
                    {summary?.on_time_delivery_change_percent !== undefined &&
                      summary.on_time_delivery_change_percent !== 0 && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                            summary.on_time_delivery_change_percent < 0
                              ? "bg-rose-50 text-rose-500 border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}
                        >
                          {formatChangePercent(
                            summary.on_time_delivery_change_percent
                          )}
                        </span>
                      )}
                  </div>
                </div>

                {/* Card 7: Average Delivery Fee */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Average Delivery Fee
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {summary?.formatted_average_delivery_fee ?? "₦0.00"}
                    </span>
                  </div>
                </div>

                {/* Card 8: Total Delivery Revenue */}
                <div className="rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between min-h-[96px]">
                  <span className="text-xs font-medium text-muted-foreground">
                    Total Delivery Revenue
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      {summary?.formatted_total_delivery_revenue ?? "₦0.00"}
                    </span>
                    {summary?.total_delivery_revenue_change_percent !==
                      undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-semibold border",
                          (summary.total_delivery_revenue_change_percent ?? 0) <
                          0
                            ? "bg-rose-50 text-rose-500 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}
                      >
                        {formatChangePercent(
                          summary.total_delivery_revenue_change_percent
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Delivery Trend */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 flex flex-col justify-between min-h-[300px]">
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground/60">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                          <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                      </span>
                      <h3 className="text-base font-semibold text-foreground">
                        Delivery Trend
                      </h3>
                    </div>

                    {/* Interval Switcher */}
                    <div className="inline-flex p-1 bg-muted/60 rounded-lg border border-border/40 gap-0.5">
                      {(["hourly", "daily", "weekly", "monthly"] as const).map(
                        (tab) => {
                          const isActive = selectedInterval === tab
                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setSelectedInterval(tab)}
                              className={cn(
                                "px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all",
                                isActive
                              ? "bg-background text-foreground shadow-xs font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {tab}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-[200px] w-full pt-4">
                    {isTrendLoading ? (
                      <div className="size-full flex items-center justify-center">
                        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : trendSeries.length === 0 ? (
                      <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                        No trend data available for this timeframe
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={trendSeries}
                          margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="label"
                            stroke="#888888"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "0.75rem",
                              fontSize: "12px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="completed"
                            name="Completed"
                            stroke="#22c55e"
                            strokeWidth={2.5}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="cancelled"
                            name="Cancelled"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="failed"
                            name="Failed"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Bottom Legend */}
                  <div className="flex items-center gap-5 pt-3 text-xs font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#22c55e]" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#ef4444]" />
                      <span>Failed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#f59e0b]" />
                      <span>Cancelled</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Status Breakdown */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 flex flex-col justify-between min-h-[300px]">
                  <div className="flex items-center gap-2 pb-2">
                    <span className="text-muted-foreground/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                      </svg>
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                      Delivery Status Breakdown
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                    {/* Donut Chart with Centered Total */}
                    <div className="relative size-44 shrink-0 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={
                              statusBreakdown.some((s) => s.value > 0)
                                ? statusBreakdown
                                : [{ key: "empty", label: "Empty", value: 1 }]
                            }
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={54}
                            outerRadius={78}
                            strokeWidth={0}
                            paddingAngle={
                              statusBreakdown.some((s) => s.value > 0) ? 3 : 0
                            }
                          >
                            {statusBreakdown.some((s) => s.value > 0) ? (
                              statusBreakdown.map((entry) => (
                                <Cell
                                  key={entry.key}
                                  fill={STATUS_COLORS[entry.key] || "#94a3b8"}
                                />
                              ))
                            ) : (
                              <Cell fill="#e2e8f0" />
                            )}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Centered label inside donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Total
                        </span>
                        <span className="text-base font-bold text-foreground">
                          {formatCompactCount(totalDeliveriesCount)}
                        </span>
                      </div>
                    </div>

                    {/* Status Items List */}
                    <div className="flex flex-col gap-3 w-full max-w-[200px]">
                      {statusBreakdown.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="size-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  STATUS_COLORS[item.key] || "#94a3b8",
                              }}
                            />
                            <span className="font-medium text-foreground">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-semibold text-foreground">
                            {item.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Delivery by Location */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Delivery by Location
                  </h3>

                  {locations.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">
                      No location delivery data for this period.
                    </p>
                  ) : (
                    <div className="space-y-3.5">
                      {locations.slice(0, 6).map((location) => {
                        const percentage = Math.min(
                          100,
                          Math.max(
                            4,
                            Math.round(
                              (location.deliveries / maxLocationDeliveries) * 100
                            )
                          )
                        )
                        return (
                          <div key={location.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-foreground">
                                {location.label}
                              </span>
                              <span className="font-bold text-foreground">
                                {formatDashboardCount(location.deliveries)}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#f97316] transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Delivery Performance */}
                <div className="rounded-2xl border border-border/80 bg-background p-5 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">
                    Delivery Performance
                  </h3>

                  <div className="space-y-4">
                    {/* 1. Preparation Time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          Average Preparation Time
                        </span>
                        <span className="font-semibold text-[#f97316]">
                          {performance?.average_prep_time_minutes ?? 0} mins
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f97316] transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((performance?.average_prep_time_minutes ?? 0) /
                                  maxPerformanceTime) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 2. Rider Pickup Time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          Rider Pickup Time
                        </span>
                        <span className="font-semibold text-[#f97316]">
                          {performance?.average_rider_pickup_minutes ?? 0} mins
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f97316] transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((performance?.average_rider_pickup_minutes ??
                                  0) /
                                  maxPerformanceTime) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 3. Rider Travel Time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          Rider Travel Time
                        </span>
                        <span className="font-semibold text-[#f97316]">
                          {performance?.average_rider_travel_minutes ?? 0} mins
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f97316] transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((performance?.average_rider_travel_minutes ??
                                  0) /
                                  maxPerformanceTime) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 4. Total Order-to-Door Time */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          Total Order-to-Door Time
                        </span>
                        <span className="font-semibold text-[#f97316]">
                          {performance?.average_order_to_door_minutes ?? 0} mins
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f97316] transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((performance?.average_order_to_door_minutes ??
                                  0) /
                                  maxPerformanceTime) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
