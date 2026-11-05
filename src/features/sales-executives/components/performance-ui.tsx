"use client"

import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { DashedProgress } from "@/components/ui/dashed-progress"
import { DashboardDateRangePicker } from "@/features/dashboard/components/dashboard-date-range-picker"
import { cn } from "@/lib/utils"

import type { SalesExecutivePeriod } from "../types"
import { formatCount, paceLabel } from "../utils/format"

const periods: { value: SalesExecutivePeriod; label: string }[] = [
  { value: "24hrs", label: "24 hrs" },
  { value: "7days", label: "7d" },
  { value: "last_month", label: "Last Month" },
  { value: "this_month", label: "This Month" },
  { value: "custom", label: "Custom" },
]

export function SalesPeriodControl({
  period,
  onPeriodChange,
  range,
  onRangeChange,
}: {
  period: SalesExecutivePeriod
  onPeriodChange: (period: SalesExecutivePeriod) => void
  range?: DateRange
  onRangeChange: (range: DateRange | undefined) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-full bg-background p-1 shadow-sm">
        {periods.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onPeriodChange(item.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              period === item.value
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {period === "custom" ? (
        <DashboardDateRangePicker
          value={range}
          onChange={onRangeChange}
          placeholder="Date"
          className="w-auto bg-background"
        />
      ) : null}
    </div>
  )
}

export function periodRange(range?: DateRange) {
  if (!range?.from || !range.to) {
    return {}
  }

  return {
    from: format(range.from, "yyyy-MM-dd"),
    to: format(range.to, "yyyy-MM-dd"),
  }
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-background p-4 shadow-sm md:p-5",
        className
      )}
    >
      {children}
    </section>
  )
}

export function ProgressBar({
  value,
  max,
  className,
}: {
  value: number
  max: number
  className?: string
}) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-primary/15", className)}>
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export function PaceBadge({ pace }: { pace: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        pace === "behind" && "bg-amber-50 text-amber-700",
        pace === "ahead" && "bg-emerald-50 text-emerald-700",
        pace === "on_track" && "bg-secondary text-foreground",
        pace === "suspended" && "bg-rose-50 text-rose-700",
        pace === "new" && "bg-sky-50 text-sky-700",
        pace === "no_signups" && "bg-amber-50 text-amber-700",
        (pace === "no_target" ||
          (pace !== "behind" &&
            pace !== "ahead" &&
            pace !== "on_track" &&
            pace !== "suspended" &&
            pace !== "new" &&
            pace !== "no_signups")) &&
          "bg-muted text-muted-foreground"
      )}
    >
      {paceLabel(pace)}
    </span>
  )
}

export function Metric({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note?: string
  accent?: string
}) {
  return (
    <Panel className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      {note ? <p className={cn("text-sm text-muted-foreground", accent)}>{note}</p> : null}
    </Panel>
  )
}

export function TargetFraction({
  qualified,
  target,
}: {
  qualified: number
  target: number
}) {
  if (!target) {
    return <span className="text-sm text-muted-foreground">No target</span>
  }

  return (
    <div className="flex min-w-28 flex-col gap-1">
      <DashedProgress value={qualified} max={target} />
      <span className="text-xs text-muted-foreground">
        {formatCount(qualified)} / {formatCount(target)}
      </span>
    </div>
  )
}
