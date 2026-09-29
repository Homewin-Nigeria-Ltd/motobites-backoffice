"use client"

import * as React from "react"
import Link from "next/link"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Icons } from "@/components/ui/icons"
import type { DateRange } from "react-day-picker"

import { DashboardPeriod } from "../enums"
import { useDashboardBnplAnalytics } from "../hooks/use-dashboard-bnpl-analytics"
import { formatDashboardCount, formatCompactCurrency } from "../utils/format"
import { useBranchFilter } from "@/context/branch-context"
import { DashboardPeriodFilter } from "../components/dashboard-period-filter"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFilterToast } from "@/hooks/use-filter-toast"
import type {
  BnplFunnelStep,
  BnplRepaymentStatusItem,
  BnplProductCategory,
} from "../types"

function formatKoboToCompact(kobo: number | null | undefined): string {
  if (typeof kobo !== "number" || isNaN(kobo)) return "₦0"
  return formatCompactCurrency(kobo / 100)
}

export function BnplAnalyticsSection() {
  const { branchId } = useBranchFilter()
  const [period, setPeriod] = React.useState<DashboardPeriod>(DashboardPeriod.TwentyFourHours)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [trendView, setTrendView] = React.useState<"daily" | "weekly" | "monthly">("daily")

  const { data: analytics, isPending, isFetching, isError, error } = useDashboardBnplAnalytics(
    period,
    dateRange,
    branchId
  )

  useFilterToast({
    isFetching,
    isPending,
    isError,
    error,
    loadingMessage: "Updating BNPL analytics...",
    successMessage: "BNPL analytics updated",
    errorMessage: "Failed to load BNPL analytics",
  })

  const handlePeriodChange = (next: DashboardPeriod) => {
    setPeriod(next)
    setDateRange(undefined)
  }

  // Fallback / Normalized values
  const kpis = analytics?.kpis
  const repaymentKpis = analytics?.repayment_kpis
  const portfolioHealth = analytics?.portfolio_health
  const profitability = analytics?.financial_profitability

  // Volume Trend chart data
  const trendData = React.useMemo(() => {
    if (analytics?.volume_trend?.length) {
      return analytics.volume_trend.map((point) => ({
        date: point.date ? point.date.split("-").slice(1).join("/") : "",
        orders: point.orders > 0 ? point.orders / 100_000 : 0,
        amount_financed: point.amount_financed > 0 ? point.amount_financed / 100_000 : 0,
        repayments: point.repayments > 0 ? point.repayments / 100_000 : 0,
        outstanding: point.outstanding_par > 0 ? point.outstanding_par / 100_000 : 0,
      }))
    }
    return []
  }, [analytics])

  // Conversion funnel
  const funnelSteps: BnplFunnelStep[] = React.useMemo(() => {
    if (analytics?.conversion_funnel?.length) {
      return analytics.conversion_funnel
    }
    return []
  }, [analytics])

  // Needs attention
  const needsAttentionList = React.useMemo(() => {
    if (analytics?.needs_attention?.length) {
      return analytics.needs_attention
    }
    return []
  }, [analytics])

  // Product categories
  const categoriesList: BnplProductCategory[] = React.useMemo(() => {
    if (analytics?.product_categories?.length) {
      return analytics.product_categories
    }
    return []
  }, [analytics])

  // Repayment status
  const repaymentStatusList: BnplRepaymentStatusItem[] = React.useMemo(() => {
    if (analytics?.repayment_status_breakdown?.length) {
      return analytics.repayment_status_breakdown
    }
    return []
  }, [analytics])

  // Customer segmentation
  const segmentsList = React.useMemo(() => {
    const map = new Map((analytics?.customer_segmentation ?? []).map((s) => [s.key, s.customers]))
    return [
      { key: "first_time_bnpl", label: "First-time BNPL", count: map.get("first_time_bnpl") ?? 0, color: "bg-blue-500" },
      { key: "repeat_bnpl", label: "Repeat BNPL", count: map.get("repeat_bnpl") ?? 0, color: "bg-emerald-500" },
      { key: "high_value", label: "High-value", count: map.get("high_value") ?? 0, color: "bg-amber-400" },
      { key: "on_time_payers", label: "On-time Payers", count: map.get("on_time_payers") ?? 0, color: "bg-emerald-500" },
      { key: "late_payers", label: "Late Payers", count: map.get("late_payers") ?? 0, color: "bg-orange-500" },
      { key: "high_risk", label: "High-risk", count: map.get("high_risk") ?? 0, color: "bg-rose-500" },
      { key: "defaulted", label: "Defaulted", count: map.get("defaulted") ?? 0, color: "bg-rose-900" },
    ]
  }, [analytics])

  // Collections Queue
  const queueList = React.useMemo(() => {
    if (analytics?.collections_queue?.length) {
      return analytics.collections_queue
    }
    return []
  }, [analytics])

  if (isError) {
    return (
      <div className="flex flex-col gap-6 bg-muted/40 p-4 md:gap-8 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load BNPL analytics."}
        </div>
      </div>
    )
  }

  if (isPending && !analytics) {
    return (
      <div className="flex flex-col gap-6 bg-muted/40 p-4 md:gap-8 md:p-6">
        <AppLoader className="flex-1 py-24" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 bg-muted/30 p-4 pb-12 md:gap-8 md:p-6">
      {/* Breadcrumb & Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground hover:underline"
            >
              Dashboard
            </Link>
            <Icons.chevronRight className="size-3 stroke-[2.5]" />
            <span className="font-medium text-amber-500">BNPL Analytics</span>
          </nav>

          {/* Title Header */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-2xs">
              <Icons.creditCard className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              BNPL Analytics
            </h1>
            {isFetching && (
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 animate-pulse dark:text-amber-400">
                <Icons.loader className="size-3.5 animate-spin" />
                Updating...
              </span>
            )}
          </div>
        </div>

        {/* Period Filter Options */}
        <div className="flex flex-wrap items-center gap-2">
          <DashboardPeriodFilter
            value={period}
            onChange={handlePeriodChange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      {/* Top Loading Progress Indicator */}
      <div className="relative -mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/40">
        {isFetching && (
          <div className="h-full w-full bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20 animate-pulse" />
        )}
      </div>

      {/* Main Content Container with Loading Transition */}
      <div className={cn("flex flex-col gap-6 transition-opacity duration-300 md:gap-8", isFetching && "opacity-75")}>
        {/* 1. Needs Attention Box */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Icons.alert className="size-4 text-rose-500" />
              <h2 className="text-sm font-semibold text-foreground">Needs Attention</h2>
            </div>
            {isFetching && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
                <Icons.loader className="size-3.5 animate-spin" />
                <span>Refreshing...</span>
              </div>
            )}
          </div>

        {needsAttentionList.length > 0 ? (
          <div className="space-y-2.5">
            {needsAttentionList.map((item, idx) => (
              <div
                key={item.key || idx}
                className="flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <span className="text-muted-foreground sm:text-sm">{item.title}</span>
                <span
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                    item.severity === "critical" &&
                      "border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400",
                    item.severity === "warning" &&
                      "border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400",
                    item.severity === "positive" &&
                      "border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                  )}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No alerts requiring attention at this time.</p>
        )}
      </div>

      {/* 2. First 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Amount Repaid */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Amount Repaid</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Icons.checkCircle2 className="size-4" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.amount_repaid_kobo ?? 0)}
          </p>
        </div>

        {/* Card 2: Repayment Rate */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Repayment Rate</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Icons.percent className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {kpis ? `${kpis.repayment_rate_percent}%` : "0%"}
          </p>
        </div>

        {/* Card 3: Active BNPL Customers */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Active BNPL Customers</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Icons.group className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatDashboardCount(kpis?.active_bnpl_customers ?? 0)}
          </p>
        </div>

        {/* Card 4: Default Rate */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Default Rate</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Icons.alertCircle className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-rose-600 sm:text-3xl dark:text-rose-400">
            {kpis ? `${kpis.default_rate_percent}%` : "0%"}
          </p>
        </div>
      </div>

      {/* 3. Middle Section (2 Columns): Volume Trend & Conversion Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: BNPL Volume Trend */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">BNPL Volume Trend</h3>
              {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/60 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTrendView("daily")}
                className={cn(
                  "rounded-lg px-2.5 py-1 transition-colors",
                  trendView === "daily"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setTrendView("weekly")}
                className={cn(
                  "rounded-lg px-2.5 py-1 transition-colors",
                  trendView === "weekly"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTrendView("monthly")}
                className={cn(
                  "rounded-lg px-2.5 py-1 transition-colors",
                  trendView === "monthly"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="h-[250px] w-full pt-2">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-border bg-background p-3 text-xs shadow-lg">
                            <p className="font-semibold text-foreground">{label}</p>
                            {payload.map((entry) => (
                              <div key={entry.name} className="mt-1 flex items-center justify-between gap-4">
                                <span style={{ color: entry.color }}>{entry.name}:</span>
                                <span className="font-medium text-foreground">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="orders" name="BNPL Orders" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="amount_financed" name="Amount Financed" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="repayments" name="Repayments" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="outstanding" name="Outstanding (PAR)" stroke="#ef4444" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No volume trend data available for this period.
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border/60 pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">BNPL Orders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Amount Financed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Repayments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="text-muted-foreground">Outstanding (PAR)</span>
            </div>
          </div>
        </div>

        {/* Right: BNPL Customer Conversion Funnel */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">BNPL Customer Conversion Funnel</h3>
              {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
            </div>
            {funnelSteps.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {formatDashboardCount(funnelSteps[0]?.count ?? 0)} Total
              </span>
            )}
          </div>

          {funnelSteps.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {funnelSteps.map((step, idx) => {
                let barColor = "bg-amber-500"
                if (idx >= 2 && idx <= 4) barColor = "bg-blue-500"
                if (idx >= 5) barColor = "bg-emerald-500"

                return (
                  <div key={step.key} className="flex items-center gap-3 text-xs">
                    <span className="w-32 shrink-0 truncate text-muted-foreground sm:w-36">
                      {step.label}
                    </span>
                    <div className="relative h-4.5 flex-1 overflow-hidden rounded-md bg-muted/70">
                      <div
                        className={cn("h-full rounded-md transition-all duration-500", barColor)}
                        style={{ width: `${Math.max(step.percent, 8)}%` }}
                      />
                    </div>
                    <div className="flex w-28 shrink-0 items-center justify-end gap-1.5 text-right font-medium">
                      <span className="text-foreground">
                        {formatDashboardCount(step.count)} ({step.percent}%)
                      </span>
                      {step.drop_percent !== null && step.drop_percent !== undefined ? (
                        <span className="text-[10px] text-rose-500">{step.drop_percent}% drop</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-12 text-xs text-muted-foreground">
              No conversion funnel data available.
            </div>
          )}
        </div>
      </div>

      {/* 4. Second 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 5: Delinquency Rate */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Delinquency Rate</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Icons.alertCircle className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {kpis ? `${kpis.delinquency_rate_percent}%` : "0%"}
          </p>
        </div>

        {/* Card 6: Avg BNPL Order Value */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Avg BNPL Order Value</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Icons.priceTag className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ₦{formatDashboardCount(Math.round((kpis?.average_bnpl_order_value_kobo ?? 0) / 100))}
          </p>
        </div>

        {/* Card 7: BNPL Revenue */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">BNPL Revenue</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Icons.store className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.bnpl_revenue_kobo ?? 0)}
          </p>
        </div>

        {/* Card 8: Net Credit Loss */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Net Credit Loss</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Icons.activity className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.net_credit_loss_kobo ?? 0)}
          </p>
        </div>
      </div>

      {/* 5. Repayment Performance (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Repayment KPIs */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-foreground">Repayment KPIs</h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>
          <div className="divide-y divide-border/60 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Due Today</span>
              <span className="font-semibold text-foreground">
                {formatKoboToCompact(repaymentKpis?.due_today_kobo ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Collected Today</span>
              <span className="font-semibold text-emerald-600">
                {formatKoboToCompact(repaymentKpis?.collected_today_kobo ?? 0)} (
                {repaymentKpis?.success_rate_percent ?? 0}%)
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Overdue</span>
              <span className="font-semibold text-rose-600">
                {formatKoboToCompact(repaymentKpis?.overdue_kobo ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Recovered</span>
              <span className="font-semibold text-emerald-600">
                {formatKoboToCompact(repaymentKpis?.recovered_kobo ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-semibold text-emerald-600">
                {repaymentKpis?.success_rate_percent ?? 0}%
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Failed Attempts</span>
              <span className="font-semibold text-rose-600">
                {formatDashboardCount(repaymentKpis?.failed_attempts ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Avg Days to Repay</span>
              <span className="font-semibold text-foreground">
                {repaymentKpis?.avg_days_to_repay ?? 0} days
              </span>
            </div>
          </div>
        </div>

        {/* Right: Repayment Status Breakdown */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-foreground">Repayment Status Breakdown</h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>

          {repaymentStatusList.length > 0 ? (
            <>
              {/* Stacked Progress Bar */}
              <div className="flex h-7 w-full overflow-hidden rounded-xl bg-muted/80">
                {repaymentStatusList.map((item) => {
                  let barColor = "bg-emerald-500"
                  if (item.key === "due_soon") barColor = "bg-blue-500"
                  if (item.key === "late_1_7") barColor = "bg-amber-400"
                  if (item.key === "late_8_30") barColor = "bg-orange-500"
                  if (item.key === "late_30_plus") barColor = "bg-rose-500"
                  if (item.key === "defaulted") barColor = "bg-rose-900"
                  return (
                    <div
                      key={item.key}
                      className={cn("h-full transition-all", barColor)}
                      style={{ width: `${item.percent}%` }}
                      title={`${item.label} (${item.percent}%)`}
                    />
                  )
                })}
              </div>

              {/* Status Breakdown Legend & Counts */}
              <div className="mt-4 space-y-2 text-xs">
                {repaymentStatusList.map((item) => {
                  let dotColor = "bg-emerald-500"
                  if (item.key === "due_soon") dotColor = "bg-blue-500"
                  if (item.key === "late_1_7") dotColor = "bg-amber-400"
                  if (item.key === "late_8_30") dotColor = "bg-orange-500"
                  if (item.key === "late_30_plus") dotColor = "bg-rose-500"
                  if (item.key === "defaulted") dotColor = "bg-rose-900"

                  return (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("size-2.5 rounded-full", dotColor)} />
                        <span className="text-muted-foreground">
                          {item.label} ({item.percent}%)
                        </span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {formatDashboardCount(item.customers)} users
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
              No repayment status data available.
            </div>
          )}
        </div>
      </div>

      {/* 6. Third 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 9: Total BNPL Orders */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total BNPL Orders</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Icons.cart className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatDashboardCount(kpis?.total_bnpl_orders ?? 0)}
          </p>
        </div>

        {/* Card 10: BNPL GMV */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">BNPL GMV</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Icons.dollarSign className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.bnpl_gmv_kobo ?? 0)}
          </p>
        </div>

        {/* Card 11: Amount Financed */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Amount Financed</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <Icons.orders className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.amount_financed_kobo ?? 0)}
          </p>
        </div>

        {/* Card 12: Outstanding Balance */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Outstanding Balance</p>
            <div className="flex items-center gap-1.5">
              {isFetching && <Icons.loader className="size-3 animate-spin text-amber-500" />}
              <div className="flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Icons.clock className="size-3.5" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatKoboToCompact(kpis?.outstanding_balance_kobo ?? 0)}
          </p>
        </div>
      </div>

      {/* 7. Portfolio Health & Product Categories (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Portfolio Health & PAR Metrics */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-semibold text-foreground">Portfolio Health & PAR Metrics</h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Total Outstanding:{" "}
            <span className="font-semibold text-foreground">
              {formatKoboToCompact(portfolioHealth?.total_outstanding_kobo ?? 0)}
            </span>
          </p>

          {/* Health Progress Bar */}
          {(() => {
            const par30 = portfolioHealth?.par_30_percent ?? 0
            const par7 = Math.max(0, (portfolioHealth?.par_7_percent ?? 0) - par30)
            const par1 = Math.max(0, (portfolioHealth?.par_1_percent ?? 0) - (portfolioHealth?.par_7_percent ?? 0))
            const current = Math.max(0, 100 - (portfolioHealth?.par_1_percent ?? 0))
            return (
              <div className="mt-3 flex h-3.5 w-full overflow-hidden rounded-full bg-muted/80">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${current}%` }} title={`Current (${current.toFixed(1)}%)`} />
                <div className="h-full bg-amber-400 transition-all" style={{ width: `${par1}%` }} title={`PAR 1-6 (${par1.toFixed(1)}%)`} />
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${par7}%` }} title={`PAR 7-29 (${par7.toFixed(1)}%)`} />
                <div className="h-full bg-rose-900 transition-all" style={{ width: `${par30}%` }} title={`PAR 30+ (${par30.toFixed(1)}%)`} />
              </div>
            )
          })()}

          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">PAR 1 (1+ Days Overdue)</p>
                <p className="text-[11px] text-muted-foreground">At risk threshold indicator</p>
              </div>
              <div className="text-right font-semibold text-foreground">
                <span className="text-sm">
                  {portfolioHealth?.par_1_percent ?? 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">PAR 7 (7+ Days Overdue)</p>
                <p className="text-[11px] text-muted-foreground">Escalated follow-up queue</p>
              </div>
              <div className="text-right font-semibold text-foreground">
                <span className="text-sm">
                  {portfolioHealth?.par_7_percent ?? 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">PAR 30 (30+ Days Overdue)</p>
                <p className="text-[11px] text-muted-foreground">Collections & write-off review</p>
              </div>
              <div className="text-right font-semibold text-foreground">
                <span className="text-sm">
                  {portfolioHealth?.par_30_percent ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: BNPL by Product Category */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-foreground">BNPL by Product Category</h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>
          {categoriesList.length > 0 ? (
            <div className="space-y-3.5 text-xs">
              {categoriesList.map((cat, idx) => {
                let barColor = "bg-amber-500"
                if (idx === 1) barColor = "bg-orange-500"
                if (idx === 2) barColor = "bg-amber-400"
                if (idx === 3) barColor = "bg-teal-500"
                if (idx === 4) barColor = "bg-blue-500"
                if (idx >= 5) barColor = "bg-emerald-500"

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-foreground">{cat.category}</span>
                      <span className="text-muted-foreground">
                        {formatDashboardCount(cat.orders)} orders | {formatKoboToCompact(cat.gmv_kobo)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${cat.percent}%` }} />
                      </div>
                      <span className="w-8 shrink-0 text-right text-[11px] font-semibold text-foreground">
                        {cat.percent}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
              No product category data available.
            </div>
          )}
        </div>
      </div>

      {/* 8. Customer Segmentation & Collections Queue (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Customer Segmentation */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-semibold text-foreground">Customer Segmentation</h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>
          <div className="space-y-3 text-xs">
            {segmentsList.map((seg) => (
              <div key={seg.key} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2.5">
                  <span className={cn("size-2 rounded-full", seg.color)} />
                  <span className="text-muted-foreground">{seg.label}</span>
                </div>
                <span className="font-semibold text-foreground">
                  {formatDashboardCount(seg.count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Collections Operational Queue */}
        <div className="rounded-2xl border border-border/80 bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Collections Operational Queue</h3>
              {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
            </div>
            {queueList.length > 0 && (
              <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                Actions Required
              </span>
            )}
          </div>

          {queueList.length > 0 ? (
            <div className="space-y-3 text-xs">
              {queueList.map((q) => {
                let dotColor = "bg-rose-500"
                let pillStyle = "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
                if (q.severity === "warning") {
                  dotColor = "bg-amber-500"
                  pillStyle = "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400"
                } else if (q.severity === "info") {
                  dotColor = "bg-blue-500"
                  pillStyle = "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400"
                } else if (q.severity === "neutral") {
                  dotColor = "bg-neutral-400"
                  pillStyle = "border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
                }

                return (
                  <div key={q.key} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("size-2 rounded-full", dotColor)} />
                      <span className="text-muted-foreground">{q.label}</span>
                    </div>
                    <span className={cn("flex size-5.5 items-center justify-center rounded-full border text-[11px] font-semibold", pillStyle)}>
                      {q.count}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-8 text-xs text-muted-foreground">
              No items currently in collections queue.
            </div>
          )}
        </div>
      </div>

      {/* 9. Financial Profitability Summary (Bottom Card) */}
      <div className="rounded-2xl border border-border/80 bg-background p-6 shadow-xs sm:p-7">
        <div className="flex items-center justify-between pb-5">
          <div className="flex items-center gap-2.5">
            <Icons.performance className="size-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              BNPL Financial Profitability Summary
            </h3>
            {isFetching && <Icons.loader className="size-3.5 animate-spin text-amber-500" />}
          </div>
          <span className="text-xs text-muted-foreground">Standard Accrual Method</span>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left: Revenue Streams */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
              Revenue Streams
            </h4>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Interest Revenue</span>
                <span className="font-semibold text-foreground">
                  {formatKoboToCompact(profitability?.revenue_streams?.interest_revenue_kobo ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service & Processing Fees</span>
                <span className="font-semibold text-foreground">
                  {formatKoboToCompact(profitability?.revenue_streams?.service_processing_fees_kobo ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Late Fees Collected</span>
                <span className="font-semibold text-foreground">
                  {formatKoboToCompact(profitability?.revenue_streams?.late_fees_collected_kobo ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/70 pt-2 font-bold text-emerald-600">
                <span>Total Gross Revenue</span>
                <span>
                  {formatKoboToCompact(profitability?.revenue_streams?.total_gross_revenue_kobo ?? 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Losses & Operational Costs */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-rose-600 uppercase">
              Losses & Operational Costs
            </h4>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Processing Costs</span>
                <span className="font-semibold text-foreground">
                  -{formatKoboToCompact(Math.abs(profitability?.losses_and_operational_costs?.payment_processing_costs_kobo ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Collection Operational Costs</span>
                <span className="font-semibold text-foreground">
                  -{formatKoboToCompact(Math.abs(profitability?.losses_and_operational_costs?.collection_operational_costs_kobo ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Credit Losses & Write-offs</span>
                <span className="font-semibold text-foreground">
                  -{formatKoboToCompact(Math.abs(profitability?.losses_and_operational_costs?.credit_losses_write_offs_kobo ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Indirect General Operations</span>
                <span className="font-semibold text-foreground">
                  -{formatKoboToCompact(Math.abs(profitability?.losses_and_operational_costs?.indirect_general_operations_kobo ?? 0))}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/70 pt-2 font-bold text-rose-600">
                <span>Total Operating Costs</span>
                <span>
                  -{formatKoboToCompact(Math.abs(profitability?.losses_and_operational_costs?.total_operating_costs_kobo ?? 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contribution Margin & Export Button */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6">
          <div className="flex flex-wrap items-baseline gap-8">
            <div>
              <p className="text-xs text-muted-foreground">Net BNPL Contribution</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl">
                {formatKoboToCompact(profitability?.net_bnpl_contribution_kobo ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contribution Margin</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {profitability ? `${profitability.contribution_margin_percent}%` : "0%"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            className="h-10 rounded-xl bg-amber-500 px-5 text-xs font-semibold text-white shadow-xs hover:bg-amber-600 active:scale-[0.98]"
            onClick={() => {
              // Trigger CSV or report export
              window.print()
            }}
          >
            Export Ledger Report
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}
