"use client"

import type { RevenueCustomerGrowthByArea } from "@/features/revenue-analytics/types"
import { formatDashboardCount } from "@/features/dashboard/utils/format"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PerformanceCustomerGrowthChartProps = {
  customerGrowth: RevenueCustomerGrowthByArea
}

const BUBBLE_META: Record<
  string,
  { label: string; color: string; legendColor: string }
> = {
  yaba: {
    label: "Yaba",
    color: "bg-red-500/90",
    legendColor: "bg-red-500",
  },
  ikoyi: {
    label: "Ikoyi",
    color: "bg-violet-600/90",
    legendColor: "bg-violet-600",
  },
  lekki: {
    label: "Lekki",
    color: "bg-orange-500/90",
    legendColor: "bg-orange-500",
  },
  surulere: {
    label: "Surulere",
    color: "bg-cyan-400/90",
    legendColor: "bg-cyan-400",
  },
}

const LEGEND_ORDER = ["yaba", "ikoyi", "lekki", "surulere"]
const DISPLAY_ORDER = ["yaba", "lekki", "ikoyi", "surulere"]

function CustomerGrowthIcon() {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
      <span className="absolute size-3 rounded-full bg-violet-600/80" />
      <span className="absolute -translate-x-2 size-3 rounded-full bg-violet-500/70" />
      <span className="absolute translate-x-2 size-3 rounded-full bg-violet-400/70" />
    </span>
  )
}

function getBubbleSize(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 80
  }

  const ratio = value / maxValue
  return Math.max(64, Math.round(ratio * 152))
}

function resolveBubbles(customerGrowth: RevenueCustomerGrowthByArea) {
  const source =
    customerGrowth.bubbles.length > 0
      ? customerGrowth.bubbles
      : customerGrowth.areas.map((area) => ({
          key: area.key,
          label: area.label,
          value: area.sales,
          revenue_formatted: area.formatted_revenue,
        }))

  const bubbleMap = new Map(source.map((bubble) => [bubble.key, bubble]))

  return DISPLAY_ORDER.map((key) => bubbleMap.get(key)).filter(
    (bubble): bubble is NonNullable<typeof bubble> => bubble != null,
  )
}

export function PerformanceCustomerGrowthChart({
  customerGrowth,
}: PerformanceCustomerGrowthChartProps) {
  const bubbles = resolveBubbles(customerGrowth)
  const maxValue = Math.max(...bubbles.map((bubble) => bubble.value), 1)

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5 pb-0">
        <PerformanceChartHeader
          title="Customer Growth"
          info="Customer sales growth across key delivery areas."
          icon={<CustomerGrowthIcon />}
        />
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {formatDashboardCount(customerGrowth.total_sales)}{" "}
          <span className="text-base font-normal text-muted-foreground">
            Sales
          </span>
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {LEGEND_ORDER.map((key) => {
            const meta = BUBBLE_META[key]
            if (!meta) {
              return null
            }

            return (
              <span key={key} className="flex items-center gap-1.5">
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", meta.legendColor)}
                />
                {meta.label}
              </span>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-6">
        {bubbles.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No customer growth data for this period.
          </p>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center py-6">
            <div className="flex items-center justify-center">
              {bubbles.map((bubble, index) => {
                const meta = BUBBLE_META[bubble.key] ?? {
                  label: bubble.label,
                  color: "bg-primary/90",
                  legendColor: "bg-primary",
                }
                const size = getBubbleSize(bubble.value, maxValue)
                const overlap = index > 0 ? Math.round(size * 0.28) : 0

                return (
                  <div
                    key={bubble.key}
                    className={cn(
                      "relative flex shrink-0 items-center justify-center rounded-full text-white shadow-sm",
                      meta.color,
                    )}
                    style={{
                      width: size,
                      height: size,
                      marginLeft: index > 0 ? -overlap : 0,
                      zIndex: bubbles.length - index,
                    }}
                  >
                    <span className="text-sm font-semibold sm:text-base">
                      {formatDashboardCount(bubble.value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
