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
import { cn } from "@/lib/utils"
import {
  Coins,
  TrendingDown,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle2,
} from "lucide-react"
import type { TotalRevenueCardData } from "../types"

type TotalRevenueModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPeriod?: DashboardPeriod
  dateRange?: { from?: Date; to?: Date }
  fulfillmentBranchId?: number | null
}

type TrendInterval = "daily" | "weekly" | "monthly"

function mapPeriodToInterval(period: DashboardPeriod): TrendInterval {
  switch (period) {
    case DashboardPeriod.TwentyFourHours:
      return "daily"
    case DashboardPeriod.Week:
      return "weekly"
    default:
      return "monthly"
  }
}

function mapIntervalToPeriod(interval: TrendInterval): DashboardPeriod {
  switch (interval) {
    case "daily":
      return DashboardPeriod.TwentyFourHours
    case "weekly":
      return DashboardPeriod.Week
    case "monthly":
      return DashboardPeriod.ThreeMonths
  }
}

const PERIOD_TABS = [
  { key: DashboardPeriod.TwentyFourHours, label: "24h" },
  { key: DashboardPeriod.Week, label: "Week" },
  { key: DashboardPeriod.ThreeMonths, label: "Month" },
  { key: DashboardPeriod.Year, label: "Year" },
]

export function TotalRevenueModal({
  open,
  onOpenChange,
  currentPeriod = DashboardPeriod.TwentyFourHours,
  dateRange,
  fulfillmentBranchId,
}: TotalRevenueModalProps) {
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
      fulfillment_branch_id: fulfillmentBranchId,
    }
  }, [selectedPeriod, fromString, toString, fulfillmentBranchId])

  const { data, isLoading, isError, error, refetch } = useQuery({
    ...dashboardQueries.cardDetails("total_revenue", queryParams, open),
  })

  const cardData = (data as unknown as TotalRevenueCardData) || null

  const handlePeriodTabChange = (periodKey: DashboardPeriod) => {
    setSelectedPeriod(periodKey)
    setSelectedInterval(mapPeriodToInterval(periodKey))
  }

  const handleIntervalChange = (interval: TrendInterval) => {
    setSelectedInterval(interval)
    setSelectedPeriod(mapIntervalToPeriod(interval))
  }

  const headlineValue = cardData?.headline?.formatted_value ?? cardData?.summary?.formatted_total_revenue ?? "₦0.00"
  const headlineChange = cardData?.headline?.change_percent ?? cardData?.summary?.total_revenue_change_percent ?? 0
  const isHeadlinePositive = headlineChange >= 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Revenue Analytics</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed financial breakdown, revenue trends, payment performance, operational adjustments, and product category sales.
        </DialogDescription>

        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50 text-amber-600 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
              <Coins className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Revenue Analytics
              </h2>
              <div className="mt-1 flex flex-wrap items-baseline gap-2.5">
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {isLoading ? "—" : headlineValue}
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
                  {headlineChange > 0 ? `+${headlineChange.toFixed(1)}%` : `${headlineChange.toFixed(1)}%`}
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
                  : "Could not retrieve revenue analytics. Please verify your connection."}
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
                label="Total Revenue"
                value={cardData.summary.formatted_total_revenue}
                changePercent={cardData.summary.total_revenue_change_percent}
              />
              <StatMetricCard
                label="Delivery Revenue"
                value={cardData.summary.formatted_delivery_revenue}
                changePercent={cardData.summary.delivery_revenue_change_percent}
              />
              <StatMetricCard
                label="Order Revenue"
                value={cardData.summary.formatted_order_revenue}
                changePercent={cardData.summary.order_revenue_change_percent}
              />
              <StatMetricCard
                label="Commission Revenue"
                value={cardData.summary.formatted_commission_revenue}
                changePercent={cardData.summary.commission_revenue_change_percent}
                badgeTheme="purple"
              />
              <StatMetricCard
                label="Average Order Value"
                value={cardData.summary.formatted_average_order_value}
                changePercent={cardData.summary.average_order_value_change_percent}
                showChange={false}
              />
              <StatMetricCard
                label="Revenue per User"
                value={cardData.summary.formatted_revenue_per_user}
                changePercent={cardData.summary.revenue_per_user_change_percent}
                badgeTheme="purple"
              />
              <StatMetricCard
                label="Refund Amount"
                value={cardData.summary.formatted_refund_amount}
                changePercent={cardData.summary.refund_amount_change_percent}
                forceNegativeColor
              />
              <StatMetricCard
                label="Net Revenue"
                value={cardData.summary.formatted_net_revenue}
                changePercent={cardData.summary.net_revenue_change_percent}
              />
            </div>

            {/* Middle Section: Revenue Trend & Payment Performance */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Left: Revenue Trend */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-bold text-foreground">
                    Revenue Trend
                  </h3>
                  <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
                    {(["daily", "weekly", "monthly"] as const).map((interval) => (
                      <button
                        key={interval}
                        type="button"
                        onClick={() => handleIntervalChange(interval)}
                        className={cn(
                          "rounded-md px-2.5 py-0.5 text-xs font-medium capitalize transition-all",
                          selectedInterval === interval
                            ? "bg-background text-foreground shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {interval}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Peak Tooltip Pill */}
                {cardData.peak && cardData.peak.amount_kobo > 0 && (
                  <div className="mb-2 flex justify-center">
                    <span className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-xs dark:bg-slate-800">
                      Peak: {cardData.peak.formatted_amount} ({cardData.peak.label})
                    </span>
                  </div>
                )}

                {/* Chart Container */}
                <div className="h-52 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cardData.revenue_trend}
                      margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="label"
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                        tickFormatter={(val: string, index: number) => {
                          const item = cardData.revenue_trend[index]
                          return item?.day || val
                        }}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val: number) => {
                          if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`
                          if (val >= 1_000) return `₦${(val / 1_000).toFixed(0)}k`
                          return `₦${val}`
                        }}
                      />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="gross_revenue"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#f97316" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="net_revenue"
                        stroke="#166534"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#166534", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#166534" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legends */}
                <div className="mt-3 flex items-center justify-start gap-6 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                    <span className="text-foreground">Gross Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#166534]" />
                    <span className="text-foreground">Net Revenue</span>
                  </div>
                </div>
              </div>

              {/* Right: Payment Performance by Channel */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Payment Performance by Channel
                  </h3>
                  <div className="mt-4 flex flex-col gap-3.5">
                    {cardData.payment_channels.map((channel) => (
                      <div
                        key={channel.key}
                        className="flex flex-col gap-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-32 truncate font-medium text-foreground">
                            {channel.label}
                          </span>
                          <div className="flex flex-1 items-center gap-3 px-2">
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(2, channel.percent)}%`,
                                  backgroundColor: channel.color,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex w-36 items-center justify-end gap-2.5 text-right font-semibold">
                            <span className="text-foreground">
                              {channel.formatted_amount}
                            </span>
                            <span className="w-10 text-[11px] text-muted-foreground">
                              {channel.percent.toFixed(1)}%
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-1 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              {channel.success_rate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Operational Sales & Product Category Performance */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Left: Operational Sales & Commercial Adjustments */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Operational Sales & Commercial Adjustments
                  </h3>

                  {/* GROSS SALES */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-500">
                      Gross Sales
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Food Sales</span>
                        <span className="font-semibold text-foreground">
                          {cardData.operational_sales.gross_sales.formatted_food_sales}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery Fees</span>
                        <span className="font-semibold text-foreground">
                          {cardData.operational_sales.gross_sales.formatted_delivery_fees}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service Charges</span>
                        <span className="font-semibold text-foreground">
                          {cardData.operational_sales.gross_sales.formatted_service_charges}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-1.5 font-bold text-foreground">
                        <span>Subtotal</span>
                        <span>
                          {cardData.operational_sales.gross_sales.formatted_subtotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADJUSTMENTS */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-500">
                      Adjustments
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between text-rose-500">
                        <span>Discounts & Promos</span>
                        <span className="font-semibold">
                          {cardData.operational_sales.adjustments.formatted_discounts}
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-500">
                        <span>Refunds</span>
                        <span className="font-semibold">
                          {cardData.operational_sales.adjustments.formatted_refunds}
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-500">
                        <span>Chargebacks</span>
                        <span className="font-semibold">
                          {cardData.operational_sales.adjustments.formatted_chargebacks}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-1.5 font-bold text-rose-600 dark:text-rose-400">
                        <span>Subtotal</span>
                        <span>
                          {cardData.operational_sales.adjustments.formatted_subtotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COMMISSIONS */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                      Commissions
                    </p>
                    <div className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Restaurant Commission</span>
                        <span className="font-semibold text-foreground">
                          {cardData.operational_sales.commissions.formatted_restaurant_commission}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Rider Commission</span>
                        <span className="font-semibold text-foreground">
                          {cardData.operational_sales.commissions.formatted_rider_commission}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                        <span>Subtotal</span>
                        <span>
                          {cardData.operational_sales.commissions.formatted_subtotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Revenue Banner */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 dark:border-emerald-800/60 dark:bg-emerald-950/30">
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Net Revenue
                  </span>
                  <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                    {cardData.operational_sales.formatted_net_revenue}
                  </span>
                </div>
              </div>

              {/* Right: Product Category Performance */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Product Category Performance
                  </h3>
                  <div className="mt-4 flex flex-col gap-3.5">
                    {cardData.category_performance.map((item) => (
                      <div
                        key={item.category}
                        className="flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {item.orders_count.toLocaleString()} orders
                            </span>
                          </div>

                          <div className="flex flex-1 items-center gap-3 px-4">
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(3, item.percent)}%`,
                                  backgroundColor: item.color,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-semibold">
                            <span className="w-10 text-right text-[11px] text-muted-foreground">
                              {item.percent.toFixed(1)}%
                            </span>
                            <span className="w-20 text-right text-foreground">
                              {item.formatted_sales}
                            </span>
                            <span className="flex items-center">
                              {item.trend === "up" ? (
                                <ArrowUp className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5 text-rose-600" />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
  changePercent,
  showChange = true,
  badgeTheme = "green",
  forceNegativeColor = false,
}: {
  label: string
  value: string | number
  changePercent?: number
  showChange?: boolean
  badgeTheme?: "green" | "purple"
  forceNegativeColor?: boolean
}) {
  const hasChange = showChange && changePercent !== undefined && changePercent !== null
  const isPositive = (changePercent ?? 0) >= 0

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-4 shadow-2xs">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {value}
        </span>
        {hasChange && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
              forceNegativeColor
                ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400"
                : badgeTheme === "purple"
                ? "border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-400"
                : isPositive
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400"
            )}
          >
            {isPositive ? `+${changePercent.toFixed(1)}%` : `${changePercent.toFixed(1)}%`}
          </span>
        )}
      </div>
    </div>
  )
}

function CustomRevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { formatted_gross?: string; formatted_net?: string } }>
  label?: string
}) {
  if (active && payload && payload.length) {
    const point = payload[0]?.payload
    return (
      <div className="rounded-xl border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
        <p className="font-bold text-foreground">{label}</p>
        <div className="mt-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            <span className="text-muted-foreground">Gross:</span>
            <span className="font-semibold text-foreground">
              {point?.formatted_gross ?? `₦${payload[0]?.value?.toLocaleString()}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#166534]" />
            <span className="text-muted-foreground">Net:</span>
            <span className="font-semibold text-foreground">
              {point?.formatted_net ?? `₦${payload[1]?.value?.toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
      </div>
    </div>
  )
}
