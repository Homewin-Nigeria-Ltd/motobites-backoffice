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
  User,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react"
import type { TotalUsersCardData } from "../types"

type TotalUsersModalProps = {
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

export function TotalUsersModal({
  open,
  onOpenChange,
  currentPeriod = DashboardPeriod.TwentyFourHours,
  dateRange,
  fulfillmentBranchId,
}: TotalUsersModalProps) {
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
    ...dashboardQueries.cardDetails("total_users", queryParams, open),
  })

  const cardData = (data as unknown as TotalUsersCardData) || null

  const handlePeriodTabChange = (periodKey: DashboardPeriod) => {
    setSelectedPeriod(periodKey)
    setSelectedInterval(mapPeriodToInterval(periodKey))
  }

  const handleIntervalChange = (interval: TrendInterval) => {
    setSelectedInterval(interval)
    setSelectedPeriod(mapIntervalToPeriod(interval))
  }

  const headlineValue = cardData?.headline?.value ?? cardData?.summary?.total_registered_users ?? 0
  const headlineChange = cardData?.headline?.change_percent ?? cardData?.summary?.total_registered_users_change_percent ?? 0
  const isHeadlinePositive = headlineChange >= 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-3xl border border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">User Analytics</DialogTitle>
        <DialogDescription className="sr-only">
          Comprehensive user demographics, user growth series, activity trends, drop-off funnel, segmentation, and top customers.
        </DialogDescription>

        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50 text-amber-600 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
              <User className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                User Analytics
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
                  : "Could not retrieve user analytics. Please verify your connection."}
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
                label="Total Registered Users"
                value={formatDashboardCount(cardData.summary.total_registered_users)}
                changePercent={cardData.summary.total_registered_users_change_percent}
              />
              <StatMetricCard
                label="New Users (Today)"
                value={formatDashboardCount(cardData.summary.new_users)}
                changePercent={cardData.summary.new_users_change_percent}
              />
              <StatMetricCard
                label="Active Users (MAU)"
                value={formatDashboardCount(cardData.summary.active_users)}
                changePercent={cardData.summary.active_users_change_percent}
              />
              <StatMetricCard
                label="Returning Users"
                value={formatDashboardCount(cardData.summary.returning_users)}
                changePercent={cardData.summary.returning_users_change_percent}
                badgeTheme="purple"
              />
              <StatMetricCard
                label="First-Time Customers"
                value={formatDashboardCount(cardData.summary.first_time_customers)}
                changePercent={cardData.summary.first_time_customers_change_percent}
                badgeTheme="purple"
              />
              <StatMetricCard
                label="Repeat Customers"
                value={formatDashboardCount(cardData.summary.repeat_customers)}
                changePercent={cardData.summary.repeat_customers_change_percent}
              />
              <StatMetricCard
                label="Dormant Users (90d)"
                value={formatDashboardCount(cardData.summary.dormant_users)}
                changePercent={cardData.summary.dormant_users_change_percent}
                badgeTheme="gray"
              />
              <StatMetricCard
                label="Churn Rate"
                value={`${cardData.summary.churn_rate_percent.toFixed(1)}%`}
                changePercent={cardData.summary.churn_rate_change_percent}
                forceNegativeColor
              />
            </div>

            {/* Middle Section: User Growth & User Activity */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Left: User Growth */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-bold text-foreground">
                    User Growth
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

                {/* Chart Container */}
                <div className="h-52 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cardData.user_growth}
                      margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="label"
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                        tickFormatter={(val: string, index: number) => {
                          const item = cardData.user_growth[index]
                          return item?.day || val
                        }}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val: number) => formatCompactCount(val)}
                      />
                      <Tooltip content={<CustomUserGrowthTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="new_registrations"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#f97316" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulative_users"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#94a3b8", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#94a3b8" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legends */}
                <div className="mt-3 flex items-center justify-start gap-6 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                    <span className="text-foreground">New Registrations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
                    <span className="text-foreground">Cumulative Users</span>
                  </div>
                </div>
              </div>

              {/* Right: User Activity */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="text-base font-bold text-foreground">
                    User Activity
                  </h3>
                  <span className="rounded-md border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
                    DAU/MAU: {cardData.user_activity.dau_mau_ratio_percent.toFixed(1)}%
                  </span>
                </div>

                {/* Chart Container */}
                <div className="h-52 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cardData.user_activity.timeline}
                      margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="label"
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-[11px] text-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val: number) => formatCompactCount(val)}
                      />
                      <Tooltip content={<CustomUserActivityTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="dau"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#f97316" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="wau"
                        stroke="#eab308"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#eab308", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#eab308" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mau"
                        stroke="#1e3a5f"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#1e3a5f", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#1e3a5f" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart Legends */}
                <div className="mt-3 flex items-center justify-start gap-6 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                    <span className="text-foreground">DAU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]" />
                    <span className="text-foreground">WAU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1e3a5f]" />
                    <span className="text-foreground">MAU</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle-Bottom Section: Customer Funnel */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3">
                <h3 className="text-base font-bold text-foreground">
                  Customer Funnel
                </h3>
                <span className="text-xs text-muted-foreground">
                  Funnel drop-off analysis
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-3">
                {cardData.customer_funnel.map((stage) => (
                  <div
                    key={stage.key}
                    className="flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-36 font-semibold text-foreground">
                        {stage.label}
                      </span>
                      <div className="flex flex-1 items-center gap-3 px-4">
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(2, stage.percent)}%`,
                              backgroundColor: stage.color,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex w-36 items-center justify-end gap-2 text-right">
                        <span className="font-bold text-foreground">
                          {formatDashboardCount(stage.value)}
                        </span>
                        <span className="w-12 text-[11px] text-muted-foreground">
                          ({stage.percent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Customer Segmentation & Top Customers */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Left: Customer Segmentation */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Customer Segmentation
                  </h3>
                  <div className="mt-4 flex flex-col gap-4">
                    {cardData.customer_segmentation.map((seg) => (
                      <div
                        key={seg.key}
                        className="flex flex-col gap-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: seg.color }}
                            />
                            <span className="font-medium text-foreground">
                              {seg.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <span>{formatDashboardCount(seg.value)}</span>
                            <span className="text-[11px] text-muted-foreground">
                              ({seg.percent.toFixed(1)}%)
                            </span>
                          </div>
                        </div>

                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(2, seg.percent)}%`,
                              backgroundColor: seg.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Top Customers */}
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-2xs">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Top Customers
                  </h3>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-[11px] font-medium text-muted-foreground">
                          <th className="pb-2 font-medium">Customer</th>
                          <th className="pb-2 text-center font-medium">Orders</th>
                          <th className="pb-2 text-right font-medium">Total Spend</th>
                          <th className="pb-2 text-right font-medium">AOV</th>
                          <th className="pb-2 text-center font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {cardData.top_customers.map((cust) => (
                          <tr key={cust.id} className="group">
                            <td className="py-2.5">
                              <p className="font-semibold text-foreground">
                                {cust.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {cust.subtitle}
                              </p>
                            </td>
                            <td className="py-2.5 text-center font-bold text-foreground">
                              {cust.orders}
                            </td>
                            <td className="py-2.5 text-right font-bold text-foreground">
                              {cust.formatted_total_spend}
                            </td>
                            <td className="py-2.5 text-right text-muted-foreground">
                              {cust.formatted_aov}
                            </td>
                            <td className="py-2.5 text-center">
                              <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                {cust.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/50 pt-3 text-center">
                  <a
                    href="/users"
                    className="text-xs font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-700 dark:text-amber-500"
                  >
                    View All Customers
                  </a>
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
  badgeTheme = "green",
  forceNegativeColor = false,
}: {
  label: string
  value: string | number
  changePercent?: number
  badgeTheme?: "green" | "purple" | "gray"
  forceNegativeColor?: boolean
}) {
  const hasChange = changePercent !== undefined && changePercent !== null
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
                : badgeTheme === "gray"
                ? "border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400"
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

function CustomUserGrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; dataKey: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
        <p className="font-bold text-foreground">{label}</p>
        <div className="mt-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            <span className="text-muted-foreground">New Registrations:</span>
            <span className="font-semibold text-foreground">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
            <span className="text-muted-foreground">Cumulative Users:</span>
            <span className="font-semibold text-foreground">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

function CustomUserActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; dataKey: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-xs">
        <p className="font-bold text-foreground">{label}</p>
        <div className="mt-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            <span className="text-muted-foreground">DAU:</span>
            <span className="font-semibold text-foreground">
              {payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#eab308]" />
            <span className="text-muted-foreground">WAU:</span>
            <span className="font-semibold text-foreground">
              {payload[1]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1e3a5f]" />
            <span className="text-muted-foreground">MAU:</span>
            <span className="font-semibold text-foreground">
              {payload[2]?.value?.toLocaleString()}
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
      <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/40" />
      </div>
    </div>
  )
}
