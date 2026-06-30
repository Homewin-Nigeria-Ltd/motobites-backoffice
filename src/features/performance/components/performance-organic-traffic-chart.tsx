"use client"

import { Icons } from "@/components/ui/icons"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"

import type { RevenueOrganicTraffic } from "@/features/revenue-analytics/types"
import {
  formatCompactCount,
  formatDashboardCount,
} from "@/features/dashboard/utils/format"
import { PerformanceChartHeader } from "@/features/performance/components/performance-chart-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type PerformanceOrganicTrafficChartProps = {
  organicTraffic: RevenueOrganicTraffic
}

const chartConfig = {
  organic: {
    label: "Organic traffic",
    color: "rgba(245, 150, 0, 0.95)",
  },
  paid: {
    label: "Paid Traffic",
    color: "rgba(255, 181, 65, 0.95)",
  },
} satisfies ChartConfig

function formatTrafficAxis(value: number) {
  if (value >= 1_000_000) {
    return `${value / 1_000_000}m`
  }

  if (value >= 1_000) {
    return `${value / 1_000}k`
  }

  return String(value)
}

export function PerformanceOrganicTrafficChart({
  organicTraffic,
}: PerformanceOrganicTrafficChartProps) {
  const hasChartData =
    organicTraffic.series.length > 0 &&
    organicTraffic.series.some(
      (point) => point.organic > 0 || point.paid > 0,
    )

  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-3 px-5 pb-0">
        <PerformanceChartHeader
          title="Organic Traffic"
          info="Visitors who reached the platform through unpaid channels."
          icon={
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.inventory className="size-4" aria-hidden />
            </span>
          }
        />
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {formatDashboardCount(organicTraffic.total)}
          </p>
          <p className="text-sm text-muted-foreground">
            {organicTraffic.per_month_label}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 shrink-0 rounded-full bg-[rgba(245,150,0,0.95)]" />
            Organic traffic
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 shrink-0 rounded-full bg-[rgba(255,181,65,0.95)]" />
            Paid Traffic
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-4">
        {!hasChartData ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No organic traffic data for this period.
          </p>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={organicTraffic.series}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatTrafficAxis(Number(value))}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval="preserveStartEnd"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatCompactCount(Number(value)),
                    name === "organic" ? "Organic traffic" : "Paid Traffic",
                  ]}
                />
              }
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="organic"
              stroke="var(--color-organic)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="paid"
              stroke="var(--color-paid)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
