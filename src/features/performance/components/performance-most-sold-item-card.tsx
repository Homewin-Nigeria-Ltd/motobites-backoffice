"use client"

import { Icons } from "@/components/ui/icons"

import type { RevenueMostSoldItem } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PerformanceMostSoldItemCardProps = {
  item: RevenueMostSoldItem
}

type SemiCircleGaugeProps = {
  percent: number
  sales: number
}

function SemiCircleGauge({ percent, sales }: SemiCircleGaugeProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <svg
        viewBox="0 0 220 130"
        className="h-[130px] w-full overflow-visible"
        aria-hidden
      >
        <path
          d="M 24 110 A 86 86 0 0 1 196 110"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d="M 24 110 A 86 86 0 0 1 196 110"
          fill="none"
          stroke="rgba(34, 197, 94, 0.95)"
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${clampedPercent} ${100 - clampedPercent}`}
        />
      </svg>
      <p className="absolute inset-x-0 bottom-6 text-center text-sm font-medium text-muted-foreground">
        {formatDashboardCount(sales)} Sales
      </p>
    </div>
  )
}

export function PerformanceMostSoldItemCard({
  item,
}: PerformanceMostSoldItemCardProps) {
  const isUp = item.trend === "up"
  const hasData = item.sales > 0 && item.name !== "—"

  return (
    <Card className="flex h-full flex-col py-5">
      <CardHeader className="px-5 pb-0">
        <PerformanceChartHeader
          title="Most Sold Item"
          icon={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Icons.soup className="size-4" aria-hidden />
            </span>
          }
        />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-5 pt-4 pb-6">
        {!hasData ? (
          <p className="flex flex-1 items-center justify-center py-8 text-center text-sm text-muted-foreground">
            No sold item data for this period.
          </p>
        ) : (
          <>
        <div className="flex flex-col items-center space-y-2 text-center">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            {item.name}
          </span>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {item.revenue_formatted}
          </p>
          <p
            className={cn(
              "text-sm font-medium",
              isUp ? "text-emerald-600" : "text-destructive",
            )}
          >
            {isUp ? "+" : "-"}
            {Math.abs(item.change_percent)}% from last month
          </p>
        </div>

        <div className="mt-auto flex items-end justify-center pt-8">
          <SemiCircleGauge percent={item.gauge_percent} sales={item.sales} />
        </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
