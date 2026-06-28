"use client"

import Image from "next/image"

import type { RevenueSparklineMetric } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { ASSETS } from "@/constants/assets"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PerformanceSparklineMetricsProps = {
  metrics: RevenueSparklineMetric[]
}

function SparklineCard({ metric }: { metric: RevenueSparklineMetric }) {
  const isUp = metric.trend === "up"

  return (
    <Card className="py-4">
      <CardContent className="px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {formatDashboardCount(metric.value)}
                {metric.key === "sale_revenue_rate" ? "%" : null}
              </p>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isUp ? "text-emerald-600" : "text-destructive",
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
                <span>{Math.abs(metric.change_percent)}%</span>
              </div>
            </div>
          </div>
          <Image
            src={ASSETS.illustrations.longUpTrend}
            alt=""
            width={91}
            height={40}
            className={cn(
              "h-10 w-auto shrink-0 object-contain",
              !isUp && "rotate-180",
            )}
            aria-hidden
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceSparklineMetrics({
  metrics,
}: PerformanceSparklineMetricsProps) {
  if (!metrics.length) {
    return (
      <Card className="flex h-full items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No metrics available.</p>
      </Card>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {metrics.map((metric) => (
        <SparklineCard key={metric.key} metric={metric} />
      ))}
    </div>
  )
}
