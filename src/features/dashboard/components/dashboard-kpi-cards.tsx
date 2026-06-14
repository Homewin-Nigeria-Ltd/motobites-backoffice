import Image from "next/image"

import type { DashboardPerformanceMetric } from "@/features/dashboard/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { ASSETS } from "@/constants/assets"
import { cn } from "@/lib/utils"

type DashboardKpiCardsProps = {
  metrics: DashboardPerformanceMetric[]
}

function formatMetricValue(metric: DashboardPerformanceMetric) {
  if (metric.display) {
    return metric.display
  }

  const base =
    typeof metric.formatted_value === "number"
      ? formatDashboardCount(metric.formatted_value)
      : metric.formatted_value

  if (!metric.suffix) {
    return base
  }

  if (metric.suffix === "%") {
    return `${base}%`
  }

  if (metric.suffix === "mins") {
    return `${base} mins`
  }

  return `${base}${metric.suffix}`
}

export function DashboardKpiCards({ metrics }: DashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const isUp = metric.trend === "up"
        const isDown = metric.trend === "down"
        const showTrend = !(metric.key === "resolved_complaints" && metric.display)

        return (
          <div
            key={metric.key}
            className="rounded-2xl border border-border bg-background p-5"
          >
            <p className="text-sm font-medium text-foreground">{metric.label}</p>
            {showTrend ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Yesterday vs. Today
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {formatMetricValue(metric)}
              </p>
              {showTrend ? (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isUp && "text-emerald-600",
                    isDown && "text-destructive"
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
                    {metric.change_percent}%
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
