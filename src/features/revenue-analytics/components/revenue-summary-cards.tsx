"use client"

import Image from "next/image"

import type { RevenueAnalyticsData, RevenueKpi } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

type RevenueSummaryCardsProps = {
  kpis: RevenueKpi[]
  period: RevenueAnalyticsData["period"]
}

function formatKpiValue(kpi: RevenueKpi) {
  if (typeof kpi.formatted_value === "number") {
    return formatDashboardCount(kpi.formatted_value)
  }

  return kpi.formatted_value
}

function getComparisonLabel(periodKey: string) {
  switch (periodKey) {
    case "24h":
      return "vs last 24 hours"
    case "week":
      return "vs last week"
    case "3months":
      return "vs last 3 months"
    case "year":
      return "vs last year"
    default:
      return "vs last period"
  }
}

function SummaryCard({
  kpi,
  comparisonLabel,
}: {
  kpi: RevenueKpi
  comparisonLabel: string
}) {
  const isUp = kpi.trend === "up"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-5">
      <Image
        src={ASSETS.illustrations.cardCorner}
        alt=""
        width={147}
        height={46}
        className="pointer-events-none absolute top-0 right-0 h-auto w-[9rem] object-contain object-top-right"
        aria-hidden
      />

      <div className="relative flex items-center gap-3">
        <Image
          src={ASSETS.illustrations.wallet}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
          aria-hidden
        />
        <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      </div>

      <div className="relative mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {formatKpiValue(kpi)}
        </p>

        <div className="pb-0.5">
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isUp ? "text-emerald-600" : "text-destructive"
            )}
          >
            <Image
              src={
                isUp
                  ? ASSETS.illustrations.shortUpTrend
                  : ASSETS.illustrations.shortDownTrend
              }
              alt=""
              width={13}
              height={8}
              className="shrink-0"
              aria-hidden
            />
            <span>
              {isUp ? "+" : "-"}
              {Math.abs(kpi.change_percent)}%
            </span>
          </div>
          <p
            className={cn(
              "text-xs font-medium",
              isUp ? "text-emerald-600" : "text-destructive"
            )}
          >
            {comparisonLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

export function RevenueSummaryCards({ kpis, period }: RevenueSummaryCardsProps) {
  const comparisonLabel = getComparisonLabel(period.key)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <SummaryCard
          key={kpi.key}
          kpi={kpi}
          comparisonLabel={comparisonLabel}
        />
      ))}
    </div>
  )
}
