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
import {
  Package,
  TrendingDown,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react"
import type { OngoingOrdersCardData } from "../types"

type OngoingOrdersModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPeriod?: DashboardPeriod
  dateRange?: { from?: Date; to?: Date }
  fulfillmentBranchId?: number | null
}

type TrendInterval = "hourly" | "daily" | "weekly"

function mapIntervalToPeriod(interval: TrendInterval): DashboardPeriod {
  switch (interval) {
    case "hourly":
      return DashboardPeriod.TwentyFourHours
    case "daily":
      return DashboardPeriod.Week
    case "weekly":
      return DashboardPeriod.ThreeMonths
  }
}

function mapPeriodToInterval(period: DashboardPeriod): TrendInterval {
  switch (period) {
    case DashboardPeriod.TwentyFourHours:
      return "hourly"
    case DashboardPeriod.Week:
      return "daily"
    default:
      return "weekly"
  }
}

const PERIOD_TABS = [
  { key: DashboardPeriod.TwentyFourHours, label: "24h" },
  { key: DashboardPeriod.Week, label: "Week" },
  { key: DashboardPeriod.ThreeMonths, label: "Month" },
  { key: DashboardPeriod.Year, label: "Year" },
]

export function OngoingOrdersModal({
  open,
  onOpenChange,
  currentPeriod = DashboardPeriod.TwentyFourHours,
  dateRange,
  fulfillmentBranchId,
}: OngoingOrdersModalProps) {
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<DashboardPeriod>(currentPeriod)
  const [selectedInterval, setSelectedInterval] = React.useState<TrendInterval>(
    () => mapPeriodToInterval(currentPeriod)
  )

  React.useEffect(() => {
    if (open) {
      setSelectedPeriod(currentPeriod)
      setSelectedInterval(mapPeriodToInterval(currentPeriod))
    }
  }, [open, currentPeriod])

  const fromString = dateRange?.from?.toISOString()
  const toString = dateRange?.to?.toISOString()

  const queryParams = React.useMemo(() => {
    return {
      period: selectedPeriod,
      from: fromString,
      to: toString,
    }
  }, [selectedPeriod, fromString, toString])

  const { data, isLoading, isError, error, refetch } = useQuery(
    dashboardQueries.cardDetails("ongoing_orders", queryParams, open)
  )

  const cardData = data as OngoingOrdersCardData | undefined

  const handlePeriodTabChange = (period: DashboardPeriod) => {
    setSelectedPeriod(period)
    setSelectedInterval(mapPeriodToInterval(period))
  }

  const handleIntervalChange = (interval: TrendInterval) => {
    setSelectedInterval(interval)
    setSelectedPeriod(mapIntervalToPeriod(interval))
  }

  const headlineValue = cardData?.summary?.total_orders ?? cardData?.headline?.value ?? 0
  const headlineChange = cardData?.summary?.total_orders_change_percent ?? cardData?.headline?.change_percent ?? 0
  const isHeadlinePositive = headlineChange >= 0

  // Peak orders calculation for the over-time chart
  const peakPoint = React.useMemo(() => {
    if (!cardData?.orders_over_time?.length) return null
    let max = cardData.orders_over_time[0]
    for (const pt of cardData.orders_over_time) {
      if (pt.value > max.value) {
        max = pt
      }
    }
    return max.value > 0 ? max : null
  }, [cardData?.orders_over_time])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl sm:p-8"
      >
        <DialogTitle className="sr-only">Order Analytics</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed ongoing orders analytics, funnel, failure analysis, and customer follow-ups
        </DialogDescription>

        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-200/70 bg-orange-50 text-orange-600 shadow-xs dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Order Analytics
              </h2>
              <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {isLoading ? "—" : formatDashboardCount(headlineValue)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-2xs",
                    isHeadlinePositive
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400"
                  )}
                >
                  {isHeadlinePositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(headlineChange).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs {selectedPeriod === DashboardPeriod.TwentyFourHours ? "last 24 hours" : "previous period"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Period selector tabs */}
            <div className="flex items-center rounded-xl border border-border bg-muted/60 p-1">
              {PERIOD_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handlePeriodTabChange(tab.key)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                    selectedPeriod === tab.key
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="my-4 flex items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>
                {error instanceof Error
                  ? error.message
                  : "Could not retrieve order analytics. Please verify your connection."}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="gap-1.5 border-destructive/30 hover:bg-destructive/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Loaded Content */}
        {!isLoading && cardData && (
          <div className="flex flex-col gap-6 pt-2">
            {/* 8 Stat Cards Grid */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <StatMetricCard
                label="Total Orders"
                value={cardData.summary.total_orders}
                change={cardData.summary.total_orders_change_percent}
                badgeVariant="rose"
              />
              <StatMetricCard
                label="New Orders"
                value={cardData.summary.new_orders}
                change={cardData.summary.new_orders_change_percent}
                badgeVariant="indigo"
              />
              <StatMetricCard
                label="Preparing"
                value={cardData.summary.preparing}
                change={cardData.summary.preparing_change_percent}
                badgeVariant="amber"
              />
              <StatMetricCard
                label="Ready for Pickup"
                value={cardData.summary.ready_for_pickup}
                change={cardData.summary.ready_for_pickup_change_percent}
                badgeVariant="amber"
              />
              <StatMetricCard
                label="Out for Delivery"
                value={cardData.summary.out_for_delivery}
                change={cardData.summary.out_for_delivery_change_percent}
                badgeVariant="indigo"
              />
              <StatMetricCard
                label="Completed"
                value={cardData.summary.completed}
                change={cardData.summary.completed_change_percent}
                badgeVariant="emerald"
              />
              <StatMetricCard
                label="Cancelled"
                value={cardData.summary.cancelled}
                change={cardData.summary.cancelled_change_percent}
                badgeVariant="rose"
              />
              <StatMetricCard
                label="Failed"
                value={cardData.summary.failed}
                change={cardData.summary.failed_change_percent}
                badgeVariant="rose"
              />
            </div>

            {/* Middle Row: Orders Over Time & Order Status Funnel */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Orders Over Time Chart */}
              <div className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 pb-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Orders Over Time
                  </h3>
                  <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
                    {(["hourly", "daily", "weekly"] as TrendInterval[]).map(
                      (intv) => (
                        <button
                          key={intv}
                          type="button"
                          onClick={() => handleIntervalChange(intv)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-all",
                            selectedInterval === intv
                              ? "bg-background text-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {intv}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Peak Callout Chip if available */}
                {peakPoint && (
                  <div className="mb-2 self-center">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/90 px-3 py-1 text-[11px] font-semibold text-background shadow-sm">
                      Peak: {formatDashboardCount(peakPoint.value)} orders ({peakPoint.label})
                    </span>
                  </div>
                )}

                <div className="h-[210px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cardData.orders_over_time}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                        tickFormatter={(v) => formatCompactCount(v)}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          const current = payload.find((p) => p.dataKey === "value")
                          const previous = payload.find((p) => p.dataKey === "previous_value")
                          return (
                            <div className="rounded-xl border border-border bg-popover/95 p-3 text-xs shadow-lg backdrop-blur-xs">
                              <p className="font-semibold text-popover-foreground mb-1.5">
                                {label}
                              </p>
                              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                                <span className="font-medium">Current:</span>
                                <span className="font-bold">
                                  {formatDashboardCount((current?.value as number) ?? 0)}
                                </span>
                              </div>
                              {previous && (
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
                                  <span className="font-medium">Previous:</span>
                                  <span className="font-bold">
                                    {formatDashboardCount((previous.value as number) ?? 0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Current"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: "#f97316" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous_value"
                        name="Previous"
                        stroke="#9ca3af"
                        strokeWidth={1.8}
                        strokeDasharray="4 4"
                        dot={false}
                        activeDot={{ r: 4, fill: "#9ca3af" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex items-center justify-center gap-6 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="font-medium">
                      {selectedPeriod === DashboardPeriod.TwentyFourHours ? "Today" : "Current"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50 border border-dashed border-muted-foreground" />
                    <span className="font-medium">
                      {selectedPeriod === DashboardPeriod.TwentyFourHours ? "Yesterday" : "Previous"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Funnel */}
              <div className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-xs">
                <div className="pb-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Order Status Funnel
                  </h3>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                  {cardData.status_funnel?.map((item) => {
                    const percent = Math.min(100, Math.max(0, item.percent))
                    const barColor = item.color ?? "#f97316"
                    return (
                      <div key={item.key} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-foreground">
                            {item.step ? `${item.step}. ` : ""}{item.label}
                          </span>
                          <span className="font-semibold text-foreground/90">
                            {formatDashboardCount(item.value)}{" "}
                            <span className="font-normal text-muted-foreground">
                              ({percent.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Order Failure Analysis & Failed Orders Follow Up */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Order Failure Analysis */}
              <div className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-xs">
                <div className="pb-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Order Failure Analysis
                  </h3>
                </div>

                <div className="flex flex-col divide-y divide-border/60">
                  {cardData.failure_analysis?.map((item) => {
                    const isTrendUp = item.trend === "up"
                    const percent = Math.min(100, Math.max(0, item.percent))
                    return (
                      <div
                        key={item.key}
                        className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color ?? "#ef4444" }}
                            />
                            <span className="font-medium text-foreground">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {formatDashboardCount(item.value)}
                            </span>
                            <span className="text-muted-foreground">
                              ({percent.toFixed(1)}%)
                            </span>
                            {isTrendUp ? (
                              <ArrowUp className="h-3.5 w-3.5 text-rose-500" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </div>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: item.color ?? "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Failed Orders → Customers to Follow Up */}
              <div className="flex flex-col rounded-2xl border border-border bg-background p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-4">
                  <span className="h-4 w-1 rounded-full bg-rose-500 shrink-0" />
                  <h3 className="text-sm font-bold text-foreground">
                    Failed Orders → Customers to Follow Up
                  </h3>
                </div>

                {cardData.failed_orders?.length ? (
                  <div className="flex flex-col divide-y divide-border/60">
                    {cardData.failed_orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-2"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">
                            Order #{order.reference}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {order.customer_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                              order.status === "failed"
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
                                : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900"
                            )}
                          >
                            {order.status_label}
                          </span>

                          <span className="hidden text-[11px] text-muted-foreground sm:inline">
                            {order.time_ago}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 rounded-lg border-amber-200 bg-amber-50/60 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300"
                            onClick={() => {
                              if (order.customer_phone) {
                                window.open(`tel:${order.customer_phone}`, "_self")
                              } else {
                                window.location.href = `/admin/orders?search=${encodeURIComponent(order.reference)}`
                              }
                            }}
                          >
                            Follow Up
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-3 text-center">
                      <a
                        href="/admin/orders?status=failed"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline dark:text-orange-400"
                      >
                        View All Failed Orders
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      No failed orders requiring follow-up for this period.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StatMetricCard({
  label,
  value,
  change = 0,
  badgeVariant = "rose",
}: {
  label: string
  value: number
  change?: number
  badgeVariant?: "rose" | "indigo" | "amber" | "emerald"
}) {
  const isPositive = change >= 0
  const formattedChange = `${isPositive ? "+" : ""}${change.toFixed(1)}%`

  const badgeStyles = {
    rose: isPositive
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900",
    indigo:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
    amber:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  }[badgeVariant]

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-xs">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-baseline justify-between gap-1">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {formatDashboardCount(value)}
        </span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            badgeStyles
          )}
        >
          {formattedChange}
        </span>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2 animate-pulse">
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-border/40 bg-muted/30"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl border border-border/40 bg-muted/30" />
        <div className="h-72 rounded-2xl border border-border/40 bg-muted/30" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl border border-border/40 bg-muted/30" />
        <div className="h-64 rounded-2xl border border-border/40 bg-muted/30" />
      </div>
    </div>
  )
}
